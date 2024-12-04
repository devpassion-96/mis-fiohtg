import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Request } from 'src/app/models/request.model';
import { Employee } from 'src/app/models/employee.model';
import { Project } from 'src/app/models/project-management/project.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-print-view',
  templateUrl: './request-print-view.component.html',
  styleUrls: ['./request-print-view.component.css']
})
export class RequestPrintViewComponent implements OnInit {
  request: Request | null = null;
  project: Project | null = null;
  employee: Employee | null = null;
  employees: Employee[] = [];

  lastCommentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.requestService.getRequestById(requestId).subscribe(requestData => {
        this.request = requestData;
        this.fetchProject(requestData.projectId);
        this.fetchEmployeeByStaffId(requestData.staffId);


           // Check if there are comments and get the last one
           if (requestData.comments && requestData.comments.length > 0) {
            const lastComment = requestData.comments[requestData.comments.length - 1];
            this.lastCommentText = lastComment.text;  // Store the last comment's text
          } else {
            this.lastCommentText = 'No comments available.';
          }

      }, error => {
        console.error('Error fetching request details', error);
        this.toastr.error('Failed to load request details');
      });
    }

    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  fetchProject(projectId: string) {
    this.projectService.getProjectById(projectId).subscribe(
      projectData => this.project = projectData,
      error => console.error('Error fetching project details', error)
    );
  }

  fetchEmployeeByStaffId(staffId: string) {
    this.employeeService.getAllEmployees().subscribe(
      employees => {
        this.employee = employees.find(e => e.staffId === staffId) || null;
        if (!this.employee) {
          console.error('Employee not found');
          this.toastr.error('Failed to load employee details');
        }
      },
      error => {
        console.error('Error fetching employees', error);
        this.toastr.error('Failed to load employees');
      }
    );
  }

  // getEmployeeNameById(id: string): string {
    
  //   const employee = this.employees.find(emp => {
  //     emp.staffId === id;
  //     console.log("employee staff id: " +emp.staffId + " id is: " + id)

  //   });

  //   // console.log('employee value is: ',employee);
  //   return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  // }

  getEmployeeNameById(id: string): string {
    const employee = this.employees.find(emp => emp.staffId === id);
  
    console.log("Searching for employee with ID:", id);
    console.log("Employee found:", employee);
  
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  
  print() {
    setTimeout(() => window.print(), 1000); // Trigger print after data is loaded
  }
}
