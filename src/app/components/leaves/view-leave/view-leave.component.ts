import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { ExtendedLeave } from 'src/app/models/leave.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';

@Component({
  selector: 'app-view-leave',
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.css']
})
export class ViewLeaveComponent {

  leave: ExtendedLeave;
    commentForm: FormGroup;
    isLoading = true;
  
    user: any;
    employees: Employee[] = [];
    submitted = false;
  
    constructor(private route: ActivatedRoute,private fb: FormBuilder,
      private toastr: ToastrService,
      private router: Router,
      private userProfileService: UserProfileService,
      private employeeService: EmployeeService, private leavesService: LeavesService) {}
  
    ngOnInit(): void {
      this.loadAllEmployees();
      this.commentForm = this.fb.group({
        comment: ['', Validators.required]
      });
  
      this.route.params.subscribe(params => {
        const id = params['id'];
        this.leavesService.getLeaveById(id).subscribe(
          leave => {
            this.leave = leave;
            console.log("Leave staffId:", this.leave.staffId); // Verify staffId
  
            this.employeeService.getEmployeeById(this.leave.staffId).subscribe(
              employee => {
                console.log("Employee Data:", employee); // Verify employee data
                this.leave.employeeName = employee.firstName + ' ' + employee.lastName;
              },
              error => {
                console.error('Error fetching employee:', error); // Check for errors in fetching employee
              }
            );
          },
          error => {
            console.error('Error fetching leave:', error); // Check for errors in fetching leave
          }
        );
      });
  
      this.populateStaffId();
    }
  
    loadAllEmployees() {
      this.employeeService.getAllEmployees().subscribe({
        next: (employees) => {
          this.employees = employees;
        },
        error: () => {
          this.toastr.error('Error fetching employees');
        }
      });
    }
  
    populateStaffId() {
      this.userProfileService.user.subscribe(
        (userData) => {
          if (userData && userData.staffId) {
            this.user = userData;
            // No need to patch the form here
          }
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  
    getEmployeeNameByStaffId(staffId: string): string {
      const employee = this.employees.find(emp => emp.staffId === staffId);
      return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    }
  
  


}
