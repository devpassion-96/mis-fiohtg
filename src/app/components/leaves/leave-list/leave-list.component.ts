import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Leave } from 'src/app/models/leave.model';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';


interface ExtendedLeave extends Leave {
  employeeName?: string;
}

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  leaves: ExtendedLeave[] = [];
  filter: string = '';

  userRole: string; // Admin, Manager, or Employee
userDepartment: string; // Department for managers
userStaffId: string; // Staff ID for employees

itemsPerPage: number = 10;
  p: number = 1;

  constructor(private leavesService: LeavesService,private authService: AuthService,private departmentService: DepartmentService,
    private toastr: ToastrService, private router: Router, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadLeaves();
  }

  loadUserRole(): void {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role;
      this.userDepartment = userData.department; // Only for managers
      this.userStaffId = userData.staffId; // Only for employees
    } else {
      this.userRole = 'employee'; // Default to employee if no user data is found
    }
  }
  

  loadLeaves() {
    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees(),
      departments: this.departmentService.getDepartments() // Fetch all departments
    })
      .pipe(
        map(({ leaves, employees, departments }) => {
          // Enrich leave requests with employee names
          const enrichedLeaves = leaves.map(leave => {
            const employee = employees.find(emp => emp.staffId === leave.staffId);
            return {
              ...leave,
              employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'
            };
          });
  
          // 🔍 Get the current user's details
          const currentUser = employees.find(emp => emp.staffId === this.userStaffId);
          if (!currentUser) return []; // If user details are missing, return empty
  
          // Fetch the user's department details
          const userDepartment = departments.find(dept => dept._id === currentUser.department);
          if (!userDepartment) return []; // If department not found, return empty
  
          // Fetch the user's designation from the department
          const userDesignation = userDepartment.designations.find(
            des => des.title.toLowerCase() === currentUser.designation.toLowerCase()
          )?.title;
  
          // 🛠 Apply role-based filtering
          if (this.userRole === 'admin') {
            return enrichedLeaves; // Admin sees all leaves
          } 
          
          else if (this.userRole === 'manager') {
            // Finance Manager or Assistant sees all leave requests
            if (
              userDepartment.name.toLowerCase() === 'finance' &&
              ['finance manager', 'finance assistant'].includes(userDesignation?.toLowerCase())
            ) {
              return enrichedLeaves;
            }
  
            // Other managers only see requests from their department
            return enrichedLeaves.filter(leave => {
              const leaveEmployee = employees.find(emp => emp.staffId === leave.staffId);
              return leaveEmployee && leaveEmployee.department === currentUser.department;
            });
          } 
          
          else if (this.userRole === 'employee') {
            return enrichedLeaves.filter(leave => leave.staffId === this.userStaffId); // ✅ Employee sees only their own leaves
          }
  
          return []; // 🔄 Default to an empty list if no role matches
        })
      )
      .subscribe({
        next: (filteredLeaves) => {
          this.leaves = filteredLeaves; // ✅ Assign filtered leaves to the component property
        },
        error: (error) => {
          console.error('Error loading leaves data', error);
        }
      });
  }
  
  



applyFilter() {
  this.leavesService.getAllLeaves().subscribe(
    data => {
      this.leaves = data.filter(leave =>
        leave.staffId.toLowerCase().includes(this.filter.toLowerCase()) ||
        leave.type.toLowerCase().includes(this.filter.toLowerCase()) ||
        leave.status.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    error => {
      console.error('Error fetching filtered leave requests:', error);
    }
  );
}


  // Methods for view, edit, delete actions

  viewLeave(id: string) {
    // Navigate to leave details page
    this.router.navigate(['/leave-details', id]);
  }

  viewLeaveOnly(id: string) {
    // Navigate to leave details page
    this.router.navigate(['/leave-view', id]);
  }

  editLeave(id: string) {
    // Navigate to leave edit page with the leave ID
    this.router.navigate(['/leave-form', id]);
  }

  deleteLeave(_id: string) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leavesService.deleteLeave(_id).subscribe(
        () => {
          // Refresh the list or handle UI updates
          this.leaves = this.leaves.filter(leave => leave._id !== _id);
          this.toastr.error('Deleted Successfully');
          this.router.navigate(['/leave-list']);
        },
        error => {
          // Handle delete error
        }
      );
    }
  }



}
