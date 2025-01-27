import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Leave } from 'src/app/models/leave.model';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';


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

  constructor(private leavesService: LeavesService,private authService: AuthService,
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

  // loadLeaves() {
  //   forkJoin({
  //     leaves: this.leavesService.getAllLeaves(),
  //     employees: this.employeeService.getAllEmployees()
  //   }).pipe(
  //     map(({ leaves, employees }) => {
  //       return leaves.map(leave => ({
  //         ...leave,
  //         employeeName: employees.find(emp => emp.staffId === leave.staffId)?.firstName + ' ' +
  //                       employees.find(emp => emp.staffId === leave.staffId)?.lastName
  //       }));
  //     })
  //   ).subscribe({
  //     next: (mappedLeaves) => {
  //       this.leaves = mappedLeaves;
  //     },
  //     error: (error) => {
  //       console.error('Error loading leaves data', error);
  //       // Handle errors here
  //     }
  //   });
  // }
  

  loadLeaves() {
    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees()
    })
      .pipe(
        map(({ leaves, employees }) => {
          // Enrich leave requests with employee names
          const enrichedLeaves = leaves.map(leave => ({
            ...leave,
            employeeName: employees.find(emp => emp.staffId === leave.staffId)?.firstName + ' ' +
                          employees.find(emp => emp.staffId === leave.staffId)?.lastName
          }));
  
          // Apply role-based filtering
          if (this.userRole === 'admin') {
            return enrichedLeaves; // Admin sees all leaves
          } else if (this.userRole === 'manager') {
            return enrichedLeaves.filter(leave =>
              employees.find(emp => emp.staffId === leave.staffId)?.department === this.userDepartment
            ); // Manager sees leaves from employees in their department
          } else if (this.userRole === 'employee') {
            return enrichedLeaves.filter(leave => leave.staffId === this.userStaffId); // Employee sees only their own leaves
          }
  
          return []; // Default to an empty list if no role matches
        })
      )
      .subscribe({
        next: (filteredLeaves) => {
          this.leaves = filteredLeaves; // Assign filtered leaves to the component property
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
