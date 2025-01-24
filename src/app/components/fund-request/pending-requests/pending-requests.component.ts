import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Request } from 'src/app/models/request.model';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {
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
            return enhancedRequests.filter(
              request => request.status === 'Pending' // Admin sees only Pending requests
            );
          } else if (this.userRole === 'manager') {
            return enhancedRequests.filter(
              request =>
                employees.find(e => e.staffId === request.staffId)?.department ===
                  this.userDepartment && request.status === 'Pending'
            ); // Manager sees requests from their department with Pending status
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
          this.requests = filteredRequests; // Assign filtered requests to the component
          this.applyFilter(); // Apply additional status-based filtering
        },
        error: () => {
          console.error('Error fetching requests');
        }
      });
  }
  

  // pendingFundsCount: number = 0; // Count of pending funds
  //   managerReviewFundsCount: number = 0; // Count for manager review
  //   hRReviewFundsCount: number = 0; // Count for HR review
  //   directorReviewFundsCount: number = 0; // Count for director review

  applyFilter() {
    this.filteredRequests = this.filterStatus === 'All' ?
                            this.requests :
                            this.requests.filter(request => request.status === this.filterStatus);
                            this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    this.totalAmountCollected = this.filteredRequests
      .filter(request => request.status === 'Approved')
      .reduce((sum, request) => sum + request.amountRequested, 0);
  }
  

  reviewRequest(_id: string) {
    this.router.navigate(['/request-review', _id]);
  }

  viewFile(fileUrl: string): void {
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove '/api' for file paths
    window.open(`${baseUrl}${fileUrl}`, '_blank');
  }
}
