import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { environment } from 'src/environments/environment';
import { Request } from 'src/app/models/request.model';

@Component({
  selector: 'app-fund-process-list',
  templateUrl: './fund-process-list.component.html',
  styleUrls: ['./fund-process-list.component.css']
})
export class FundProcessListComponent {

  requests: Request[] = [];
  filteredRequests: Request[] = []; // Use ExtendedRequest type here
  filterStatus: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'All' = 'All';

  totalAmountCollected: number = 0;

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
        this.requests = mappedRequests.filter(request => request.status === 'Approved' && !request.paymentDetails);;
      },
      error: () => {
        // Handle error
      }
    });
  }

  reviewRequest(_id: string) {
    this.router.navigate(['/fund-process', _id]);
  }
  viewFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }
}
