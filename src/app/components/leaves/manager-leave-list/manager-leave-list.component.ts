import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { ExtendedLeave } from 'src/app/models/leave.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';

@Component({
  selector: 'app-manager-leave-list',
  templateUrl: './manager-leave-list.component.html',
  styleUrls: ['./manager-leave-list.component.css']
})
export class ManagerLeaveListComponent {
leaves: ExtendedLeave[] = [];
  filter: string = '';
  user: any; // Logged-in user details  

  constructor(private leavesService: LeavesService, private departmentService: DepartmentService,
    private userProfileService: UserProfileService, private router: Router, private employeeService: EmployeeService) {}

  ngOnInit(): void {
   
    this.loadUserDetails();
    
  }

  loadUserDetails() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData) {
          this.user = userData; // Get the logged-in user's role and department
          this.loadLeaves(); // Load leaves after user details are fetched
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

loadLeaves() {
  forkJoin({
    leaves: this.leavesService.getAllLeaves(),
    employees: this.employeeService.getAllEmployees(),
    departments: this.departmentService.getDepartments() // Add departments to the forkJoin
  })
    .pipe(
      map(({ leaves, employees, departments }) => {
        return leaves.map(leave => {
          const employee = employees.find(emp => emp.staffId === leave.staffId);

          console.log('Processing Leave:', leave);
          console.log('Matched Employee:', employee);

          let employeeDepartmentName = 'Unknown Department';
          let employeeDepartmentId = null;

          if (employee) {
            // Find employee's department by ID
            const employeeDepartment = departments.find(dept => {
              return dept._id.toString() === employee.department.toString();
            });

            if (employeeDepartment) {
              employeeDepartmentName = employeeDepartment.name;
              employeeDepartmentId = employeeDepartment._id;
            }
          }

          return {
            ...leave,
            employeeName: `${employee?.firstName || 'Unknown'} ${employee?.lastName || ''}`,
            department: employeeDepartmentName,
            departmentId: employeeDepartmentId || 'Unknown Department'
          };
        });
      })
    )
    .subscribe({
      next: (mappedLeaves) => {
        console.log('Mapped Leaves:', mappedLeaves);
        console.log('USER ROLE From Leave:', this.user?.role);

        if (this.user) {
          if (this.user.role === 'admin') {
            // Admins see all pending leaves
            this.leaves = mappedLeaves.filter(leave => leave.status === 'Pending');
            console.log('Admin Role: Showing all pending leaves');
          } else if (this.user.role === 'manager') {
            // Managers see pending leaves for their department
            this.leaves = mappedLeaves.filter(leave => {
           
              const isSameDepartment = leave.departmentId === this.user.department;
              const isPending = leave.status === 'Pending';


              return isSameDepartment && isPending;
            });
            console.log('Manager Role: Showing pending leaves for department:', this.user.department);
          }
        } else {
          // Fallback: Show all pending leaves
          this.leaves = mappedLeaves.filter(leave => leave.status === 'Pending');
          console.warn('User not defined. Showing all pending leaves.');
        }
      },
      error: (error) => {
        console.error('Error loading leave data:', error);
      }
    });
}








applyFilter() {
  this.leaves = this.leaves.filter(
    (leave) =>
      leave.staffId.toLowerCase().includes(this.filter.toLowerCase()) ||
      leave.type.toLowerCase().includes(this.filter.toLowerCase()) ||
      leave.status.toLowerCase().includes(this.filter.toLowerCase())
  );
}


  // Methods for view, edit, delete actions

  viewLeave(id: string) {
    // Navigate to leave details page
    this.router.navigate(['/leave-details', id]);
  }

  editLeave(id: string) {
    // Navigate to leave edit page with the leave ID
    this.router.navigate(['/leave-edit', id]);
  }

  deleteLeave(id: string) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leavesService.deleteLeave(id).subscribe(
        () => {
          // Refresh the list or handle UI updates
          this.leaves = this.leaves.filter(leave => leave._id !== id);
        },
        error => {
          // Handle delete error
        }
      );
    }
  }

}
