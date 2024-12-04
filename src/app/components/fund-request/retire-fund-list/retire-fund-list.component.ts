import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Project } from 'src/app/models/project-management/project.model';
import { RetireFund } from 'src/app/models/retire-fund.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { RetireFundService } from 'src/app/services/project-management/retire-fund.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retire-fund-list',
  templateUrl: './retire-fund-list.component.html',
  styleUrls: ['./retire-fund-list.component.css']
})
export class RetireFundListComponent {
  retiredFunds: RetireFund[] = [];
  filteredretiredFunds: RetireFund[] = [];

  employees: Employee[] = [];
  projects: Project[] = [];

  constructor(private retiredFundservice: RetireFundService,
    private router: Router,
    private employeeService: EmployeeService,
    private projectService: ProjectService ) {}

  ngOnInit() {
    this.loadRetiredFunds();
    this.loadEmployees();
    this.loadProjects();
  }


  loadRetiredFunds() {
    this.retiredFundservice.getAllRetireFundRecords().subscribe(data => {
      this.retiredFunds = data;
      this.filteredretiredFunds = data; // Initially, filtered list is the full list
    });
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe(data => {
      this.projects = data;
    });
  }

  getEmployeeNameById(id: string): string {
    const employee = this.employees.find(emp => emp.staffId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }



  getProjectNameById(projectId: string) {
    const project = this.projects.find(prj => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }

  onSearch(searchTerm: string) {
    // this.filteredretiredFunds = this.retiredFunds.filter(employee =>
    //   employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );
  }
  deleteRetiredFund(id: string) {
    this.retiredFundservice.deleteRetireFundRecord(id).subscribe(() => {
      this.loadRetiredFunds(); // Refresh the list after deletion
    });
  }

  viewFile(fileUrl: string): void {
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove '/api' for file paths
    window.open(`${baseUrl}${fileUrl}`, '_blank');
  }

}
