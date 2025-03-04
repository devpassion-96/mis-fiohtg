import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { Request } from 'src/app/models/request.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-finance-review-list',
  templateUrl: './finance-review-list.component.html',
  styleUrls: ['./finance-review-list.component.css']
})
export class FinanceReviewListComponent {
  requests: Request[] = [];

  itemsPerPage: number = 10;
  p: number = 1;

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
        this.requests = mappedRequests.filter(request => request.status === 'M&EReview');;
      },
      error: () => {
        // Handle error
      }
    });
  }

  reviewRequest(_id: string) {
    this.router.navigate(['/request-review', _id]);
  }

  viewFile(fileUrl: string): void {
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove '/api' for file paths
    window.open(`${baseUrl}${fileUrl}`, '_blank');
  }
  

}
