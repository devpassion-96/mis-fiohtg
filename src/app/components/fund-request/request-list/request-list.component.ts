import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Request } from 'src/app/models/request.model';
import { Project } from 'src/app/models/project-management/project.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';



@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: Request[] = [];
  filteredRequests: Request[] = []; // Use ExtendedRequest type here
  filterStatus: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'All' = 'All';

  totalAmountCollected: number = 0;

  userRole: string; // To store the role of the logged-in user
  
  userDepartment: string;
  userStaffId: string;


  constructor(
    private requestService: RequestService,
    private projectService: ProjectService,private authService: AuthService,
    private employeeService: EmployeeService, private router: Router
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.loadUserRole();
  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role; // Role of the user
      this.userDepartment = userData.department; // Department for managers
      this.userStaffId = userData.staffId; // Staff ID for employees
    } else {
      this.userRole = 'Employee';
    }
  }

  // loadRequests() {
  //   forkJoin({
  //     requests: this.requestService.getAllRequestRecords(),
  //     projects: this.projectService.getAllProjectRecords(),
  //     employees: this.employeeService.getAllEmployees()
  //   }).pipe(
  //     map(({ requests, projects, employees }) => {
  //       return requests.map(request => ({
  //         ...request,
  //         projectName: projects.find(p => p._id === request.projectId)?.name,
  //         employeeName: employees.find(e => e.staffId === request.staffId)?.firstName + ' ' + employees.find(e => e.staffId === request.staffId)?.lastName
  //       })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  //     })
  //   ).subscribe({
  //     next: (mappedRequests) => {
  //       this.requests = mappedRequests;
  //       this.calculateTotalAmount();
  //       this.applyFilter();
  //     },
  //     error: () => {
  //       // Handle error
  //     }
  //   });
  // }

  loadRequests() {
    forkJoin({
      requests: this.requestService.getAllRequestRecords(),
      projects: this.projectService.getAllProjectRecords(),
      employees: this.employeeService.getAllEmployees()
    })
      .pipe(
        map(({ requests, projects, employees }) => {
          // Enhance requests with project and employee details
          const enhancedRequests = requests.map(request => ({
            ...request,
            projectName: projects.find(p => p._id === request.projectId)?.name,
            employeeName: employees.find(e => e.staffId === request.staffId)?.firstName + 
                          ' ' + 
                          employees.find(e => e.staffId === request.staffId)?.lastName
          }));
  
          // Apply role-based filtering logic
          if (this.userRole === 'admin') {
            return enhancedRequests; // Admin sees all requests
          } else if (this.userRole === 'manager') {
            return enhancedRequests.filter(
              request =>
                employees.find(e => e.staffId === request.staffId)?.department ===
                this.userDepartment
            ); // Manager sees requests from their department
          } else if (this.userRole === 'employee') {
            return enhancedRequests.filter(
              request => request.staffId === this.userStaffId
            ); // Employee sees only their own requests
          }
  
          return []; // Default to an empty list if no role matches
        })
      )
      .subscribe({
        next: (filteredRequests) => {
          this.requests = filteredRequests;
          this.applyFilter(); // Apply additional status-based filtering
        },
        error: () => {
          // Handle error
        }
      });
  }
  
  applyFilter() {
    this.filteredRequests = this.filterStatus === 'All' ?
                            this.requests :
                            this.requests.filter(request => request.status === this.filterStatus);
                            this.calculateTotalAmount();
  }

  // calculateTotalAmount() {
  //   this.totalAmountCollected = this.requests
  //     .filter(request => request.status === 'Approved')
  //     .reduce((sum, request) => sum + request.amountRequested, 0);
  // }
  calculateTotalAmount() {
    this.totalAmountCollected = this.filteredRequests
      .filter(request => request.status === 'Approved')
      .reduce((sum, request) => sum + request.amountRequested, 0);
  }
  

  onFilterChange(status: string) {
    this.filterStatus = status as 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'All';
    this.applyFilter();
  }

  // In your request list component
printRequestDetails(requestId: string) {
  this.router.navigate(['/print-request', requestId]);
}

exportExcel() {
  // Create a new workbook and a sheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRequests);

  // Add the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Requests');

  // Define the name for the Excel file
  const fileName = 'Funding_Requests.xlsx';

  // Write the workbook and save the file
  XLSX.writeFile(wb, fileName);
}

viewFile(fileUrl: string): void {
  const baseUrl = environment.apiUrl.replace('/api', ''); // Remove '/api' for file paths
  window.open(`${baseUrl}${fileUrl}`, '_blank');
}

}
