import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CountsService } from 'src/app/services/notification.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  counts: any = {};
  userRole: string;
  userStaffId: string;
  userDepartmentId: string;
  userDepartmentName: string;
  userDesignation: string;
  allDepartments: any[] = [];

  constructor(
    private countsService: CountsService,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getCurrentUserData();
    this.userRole = userData?.role || 'Employee';
    this.userStaffId = userData?.staffId || '';

    this.countsService.counts$.subscribe(counts => {
      if (counts) {
        this.counts = counts;
      }
    });

    this.countsService.initializeCounts();
    this.loadUserDepartmentAndDesignation();
  }

  /**
   * Load the current user's department and designation from the employees table.
   */
  loadUserDepartmentAndDesignation() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        const employee = employees.find(emp => emp.staffId === this.userStaffId);

        if (employee) {
          this.userDepartmentId = employee.department; // Fetch department ID
          this.userDesignation = employee.designation; // Fetch designation

          // Fetch department details using department ID
          this.departmentService.getDepartmentById(this.userDepartmentId).subscribe({
            next: (department) => {
              if (department) {
                this.userDepartmentName = department.name; // Store department name
                this.allDepartments = [department]; // Store department for access checks
              } else {
                this.userDepartmentName = null;
              }
            },
            error: (err) => {
              console.error('Error fetching department details:', err);
              this.userDepartmentName = null;
            }
          });
        } else {
          console.warn('User not found in employees table.');
          this.userDepartmentId = null;
          this.userDesignation = null;
        }
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  /**
   * Checks if the current user has access based on department and designation.
   */
  canAccess(departmentDesignationPairs: { department: string; designations: string[] }[]): boolean {
    // Admins have access to everything
    if (this.userRole?.toLowerCase() === 'admin') {
      return true;
    }

    // Ensure the user's department exists in the fetched data
    const userDepartment = this.allDepartments.find(
      (dept) => dept.name.toLowerCase() === this.userDepartmentName?.toLowerCase()
    );

    if (!userDepartment) {
      return false; // No access if department is not found
    }

    // Check if the user's designation matches any allowed designations for the department
    return departmentDesignationPairs.some(({ department, designations }) => {
      if (department.toLowerCase() !== userDepartment.name.toLowerCase()) {
        return false; // Department mismatch
      }

      return designations.some(
        (designation) => designation.toLowerCase() === this.userDesignation?.toLowerCase()
      );
    });
  }
}
