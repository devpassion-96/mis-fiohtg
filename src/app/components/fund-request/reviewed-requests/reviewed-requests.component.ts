import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Request } from 'src/app/models/request.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { forkJoin, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reviewed-requests',
  templateUrl: './reviewed-requests.component.html',
  styleUrls: ['./reviewed-requests.component.css']
})
export class ReviewedRequestsComponent {

  requests: Request[] = [];
  filteredRequests: Request[] = []; // Use ExtendedRequest type here
  filterStatus: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'All' = 'All';

  totalAmountCollected: number = 0;

  constructor(
    private requestService: RequestService,
    private projectService: ProjectService,
    private employeeService: EmployeeService, private router: Router
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    forkJoin({
      requests: this.requestService.getAllRequestRecords(),
      projects: this.projectService.getAllProjectRecords(),
      employees: this.employeeService.getAllEmployees()
    }).pipe(
      map(({ requests, projects, employees }) => {
        return requests.map(request => ({
          ...request,
          projectName: projects.find(p => p._id === request.projectId)?.name,
          employeeName: employees.find(e => e.staffId === request.staffId)?.firstName + ' ' + employees.find(e => e.staffId === request.staffId)?.lastName
        }));
      })
    ).subscribe({
      next: (mappedRequests) => {
        this.requests = mappedRequests.filter(request => request.status === 'Reviewed');;
      },
      error: () => {
        // Handle error
      }
    });
  }

  reviewRequest(_id: string) {
    this.router.navigate(['/request-approval', _id]);
  }
  viewFile(fileUrl: string): void {
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove '/api' for file paths
    window.open(`${baseUrl}${fileUrl}`, '_blank');
  }
  

}


