import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { Leave } from 'src/app/models/leave.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { ActivatedRoute } from '@angular/router';

interface LeaveBalance {
  taken: number;
  remaining: number;
}

interface EmployeeLeaveBalances {
  [staffId: string]: LeaveBalance;
}

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
})
export class LeaveApplicationComponent implements OnInit {
  leaveForm: FormGroup;
  employees: Employee[] = [];
  leaves: Leave[] = [];
  leaveTypes: string[] = ['Annual', 'Sick Leave', 'Maternity and Paternity Leave', 'Unpaid Leave', 'Educational Leave', 'Sabbatical Leave', 'Toil', 'Compassionate', 'Casual Leave' ];
  leaveBalances: EmployeeLeaveBalances = {};

  user: any;
  submitted = false;

  currentLeaveId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private leavesService: LeavesService,
    private employeeService: EmployeeService,
    private router: Router, private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      staffId: ['', Validators.required],
      handingOverTo: ['', Validators.required],
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      remarks: [''],
      appliedOn: [new Date(), Validators.required],
      status: ['Pending']
    }, { validators: this.dateValidator });

    this.populateStaffId();

    this.employeeService.getAllEmployees().subscribe(employeesData => {
      this.employees = employeesData;
      this.leavesService.getAllLeaves().subscribe(leavesData => {
        this.leaves = leavesData;
        this.leaveBalances = this.calculateLeaveBalances();
      });
    });

    // Load leave details if editing an existing leave
    this.route.paramMap.subscribe(params => {
      this.currentLeaveId = params.get('id');
      if (this.currentLeaveId) {
        this.loadLeaveData(this.currentLeaveId);
      }
    });
  }

  // loadLeaveData(leaveId: string) {
  //   this.leavesService.getLeaveById(leaveId).subscribe({
  //     next: (leave) => {
  //       this.leaveForm.patchValue({
  //         staffId: leave.staffId,
  //         handingOverTo: leave.handingOverTo,
  //         type: leave.type,
  //         startDate: this.formatDate(leave.startDate),
  //         endDate: this.formatDate(leave.endDate),
  //         remarks: leave.remarks,
  //         status: leave.status
  //       });
  //     },
  //     error: () => this.toastr.error('Error loading leave data')
  //   });
  // }

  loadLeaveData(leaveId: string) {
    this.leavesService.getLeaveById(leaveId).subscribe({
      next: (leave) => {
        this.leaveForm.patchValue({
          staffId: leave.staffId,
          handingOverTo: leave.handingOverTo,
          type: leave.type,
          startDate: this.formatDate(leave.startDate),
          endDate: this.formatDate(leave.endDate),
          remarks: leave.remarks,
          status: leave.status
        });
  
        // Disable fields if status is "Approved"
        if (leave.status === 'Approved' || leave.status === 'Rejected') {
          this.leaveForm.disable();
        } else {
          this.leaveForm.enable();
        }
      },
      error: () => this.toastr.error('Error loading leave data')
    });
  }
  

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.leaveForm.patchValue({ staffId: userData.staffId });
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    if (!this.user) {
      this.userProfileService.getUserProfile();
    }
  }

  calculateLeaveBalances(): EmployeeLeaveBalances {
    const balances: EmployeeLeaveBalances = {};
    const maxLeaveEntitlement = 21; // Maximum leave days allowed per year
    const currentYear = new Date().getFullYear();

    // Initialize balances for all employees
    this.employees.forEach(employee => {
      balances[employee.staffId] = { taken: 0, remaining: maxLeaveEntitlement };
    });

    // Calculate the actual leave taken and remaining for the current year
    this.employees.forEach(employee => {
      const employeeLeaves = this.leaves.filter(leave => leave.staffId === employee.staffId);
      let totalDaysTaken = employeeLeaves.reduce((sum, leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);

        // Only consider leaves within the current year
        if (startDate.getFullYear() === currentYear && endDate.getFullYear() === currentYear) {
          return sum + (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
        }
        return sum;
      }, 0);

      balances[employee.staffId] = {
        taken: totalDaysTaken,
        remaining: Math.max(0, maxLeaveEntitlement - totalDaysTaken)
      };
    });

    return balances;
  }

  requestLeave(leaveRequest: any): boolean {
    const requestedDays = (new Date(leaveRequest.endDate).getTime() - new Date(leaveRequest.startDate).getTime()) / (1000 * 3600 * 24) + 1;

    if (this.leaveBalances[leaveRequest.staffId].remaining >= requestedDays) {
      return true;
    } else {
      this.toastr.error('Leave Balance exceeded', 'Error')
      return false;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.leaveForm.valid) {
      if (this.currentLeaveId) {
        this.updateLeave();
      } else {
        this.createLeave();
      }
    } else {
      this.toastr.error('Please fill all the required fields', 'Error');
    }
  }

  createLeave() {
    if (this.leaveForm.valid && this.user && this.user.staffId) {
      const leaveRequest = {
        ...this.leaveForm.value,
        staffId: this.user.staffId
      };

      if (this.requestLeave(leaveRequest)) {
        this.leavesService.addLeave(leaveRequest).subscribe({
          next: () => {
            this.toastr.success('Leave request submitted', 'Success');
            this.router.navigate(['/']);
            this.leaveForm.reset(); // Reset form after submission
            this.submitted = false; // Reset submitted flag
          },
          error: (err) => {
            console.error('Error applying for leave:', err);
            this.toastr.error('Failed to submit leave request', 'Error');
          }
        });
      }
    } else {
      this.toastr.error('Please fill all the required fields', 'Error');
      console.error('Form is not valid or user data is not available');
    }
  }

  // updateLeave() {
  //   const leaveRequest = { ...this.leaveForm.value, staffId: this.user.staffId };
  //   this.leavesService.updateLeave(this.currentLeaveId, leaveRequest).subscribe({
  //     next: () => {
  //       this.toastr.success('Leave updated successfully', 'Success');
  //       this.router.navigate(['/leave-list']);
  //       this.leaveForm.reset(); // Reset form after update
  //       this.submitted = false; // Reset submitted flag
  //     },
  //     error: (err) => this.toastr.error('Failed to update leave', 'Error')
  //   });
  // }

  // formatDate(date: Date): string {
  //   if (date instanceof Date) {
  //     return new Date(date).toISOString().split('T')[0];
  //   }
  //   return '';
  // }

  updateLeave() {
    const { staffId, ...leaveRequest } = this.leaveForm.value; // Exclude staffId
    this.leavesService.updateLeave(this.currentLeaveId, leaveRequest).subscribe({
      next: () => {
        this.toastr.success('Leave updated successfully', 'Success');
        this.router.navigate(['/leave-list']);
        this.leaveForm.reset(); // Reset form after update
        this.submitted = false; // Reset submitted flag
      },
      error: (err) => this.toastr.error('Failed to update leave', 'Error')
    });
  }
  
  formatDate(date: any): string {
    if (!date) return ''; // Avoids errors if date is null/undefined
    return new Date(date).toISOString().split('T')[0];
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateInvalid: 'Start date should be before end date' };
    }
    return null;
  }

  // dateValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const startDate = control.get('startDate')?.value;
  //     const endDate = control.get('endDate')?.value;
  //     if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
  //       return { dateInvalid: true };
  //     }
  //     return null;
  //   };
  // }
  
}
