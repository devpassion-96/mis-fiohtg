import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  userRole: string; // To store the role of the logged-in user
  
  userDepartment: string;
  userStaffId: string;

  itemsPerPage: number = 10;
  p: number = 1;

  constructor(private employeeService: EmployeeService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadEmployees();
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
  


 loadEmployees() {

    this.employeeService.getAllEmployees().subscribe((data) => {
      this.employees = data;

      // Apply filtering based on the user's role
      if (this.userRole === 'admin') {
        this.filteredEmployees = this.employees; // Admin sees all employees
      } else if (this.userRole === 'manager') {
        this.filteredEmployees = this.employees.filter(
          (employee) => employee.department === this.userDepartment
        );
      } else if (this.userRole === 'employee') {
        this.filteredEmployees = this.employees.filter(
          (employee) => employee.staffId === this.userStaffId
        );
      }
    });
  }


  onSearch(searchTerm: string) {
    this.filteredEmployees = this.employees.filter(employee =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  deleteEmployee(_id: string) {
    // Prompt the user to confirm the deletion
    const confirmation = confirm('Are you sure you want to delete this employee?');

    // Check if the user confirmed the action
    if (confirmation) {
      this.employeeService.deleteEmployee(_id).subscribe(
        () => {
          // Refresh the list after successful deletion
          this.loadEmployees();
          alert('Employee deleted successfully!');
        },
        (error) => {
          // Handle any errors from the server or network issues
          alert('Failed to delete the employee. Please try again.');
        }
      );
    }
  }
  editEmployee(employee: Employee) {
    this.router.navigate(['/employee-form', employee._id]);
  }

  viewEmployeeDetails(employee: Employee) {
    this.router.navigate(['/employee-detail', employee._id]);
  }
}
