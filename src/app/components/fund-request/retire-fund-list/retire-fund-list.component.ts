import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { Project } from 'src/app/models/project-management/project.model';
import { RetireFund } from 'src/app/models/retire-fund.model';
import { AuthService } from 'src/app/services/auth/auth.service';
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
  filteredRetiredFunds: RetireFund[] = [];
 
  employees: Employee[] = [];
  projects: Project[] = [];

  userRole: string; // Store the role of the current user
  userDepartment: string; // Store the user's department (for managers)
  userStaffId: string; // Store the user's staff ID (for employees)

  itemsPerPage: number = 10;
  p: number = 1;

  constructor(private retiredFundservice: RetireFundService,
    private router: Router,  private authService: AuthService,
    private employeeService: EmployeeService,
    private projectService: ProjectService ) {}

  ngOnInit() {
    this.loadUserRole();
    this.loadRetiredFunds();
    this.loadEmployees();
    this.loadProjects();
  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role; // User's role
      this.userDepartment = userData.department; // Department for managers
      this.userStaffId = userData.staffId; // Staff ID for employees
    } else {
      this.userRole = 'Employee'; // Default to "Employee" if no data is available
    }
  }

  // loadRetiredFunds() {
  //   this.retiredFundservice.getAllRetireFundRecords().subscribe(data => {
  //     this.retiredFunds = data;
  //   console.log("retired funds: ", data)
  //     this.filteredretiredFunds = data; // Initially, filtered list is the full list
  //   });
  // }
  
  loadRetiredFunds() {
    forkJoin({
      retiredFunds: this.retiredFundservice.getAllRetireFundRecords(),
      employees: this.employeeService.getAllEmployees(),
      projects: this.projectService.getAllProjectRecords()
    })
      .pipe(
        map(({ retiredFunds, employees, projects }) => {
          // Enrich retired funds with project and employee details
          const enrichedRetiredFunds = retiredFunds.map(fund => ({
            ...fund,
            projectName: projects.find(p => p._id === fund.projectId)?.name || 'Unknown',
            employeeName: employees.find(e => e.staffId === fund.staffId)?.firstName + 
                          ' ' + 
                          employees.find(e => e.staffId === fund.staffId)?.lastName || 'Unknown'
          }));
  
          // Apply role-based filtering logic
          if (this.userRole === 'admin') {
            return enrichedRetiredFunds; // Admin sees all retired funds
          } else if (this.userRole === 'manager') {
            return enrichedRetiredFunds.filter(
              fund =>
                employees.find(e => e.staffId === fund.staffId)?.department ===
                this.userDepartment // Filter by department
            );
          } else if (this.userRole === 'employee') {
            return enrichedRetiredFunds.filter(
              fund => fund.staffId === this.userStaffId // Filter by staff ID
            );
          }
  
          return []; // Default to an empty list if no role matches
        })
      )
      .subscribe({
        next: (filteredFunds) => {
          this.retiredFunds = filteredFunds;
          this.filteredRetiredFunds = filteredFunds;
        },
        error: () => {
          // Handle error appropriately
          console.error('Failed to load retired funds.');
        }
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
    window.open(fileUrl, '_blank');
  }

}
