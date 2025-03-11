import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { Leave } from 'src/app/models/leave.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { Employee } from 'src/app/models/employee.model';


interface ExtendedLeave extends Leave {
  employeeName?: string;
}

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  pendingLeaves: ExtendedLeave[] = [];
  selectedLeave: ExtendedLeave | null = null;
  @ViewChild('leaveDetailsModal') leaveDetailsModal: ElementRef;

  employees: Employee[] = [];
  user: any;
  
  itemsPerPage: number = 10;
  p: number = 1;

  constructor(
    private leavesService: LeavesService,
    private userProfileService: UserProfileService,
    private router: Router,private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchPendingLeaves();
    this.loadAllEmployees();
    this.populateStaffId();


  }

  populateStaffId() {
  this.userProfileService.user.subscribe(
    (userData) => {
      if (userData && userData.staffId) {
        this.user = userData;
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

getEmployeeNameByStaffId(staffId: string): string {
  const employee = this.employees.find(emp => emp.staffId === staffId);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
}

  fetchPendingLeaves() {
    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees()
    }).pipe(
      map(({ leaves, employees }) => {
        return leaves.map(leave => ({
          ...leave,
          employeeName: employees.find(emp => emp.staffId === leave.staffId)?.firstName + ' ' +
                        employees.find(emp => emp.staffId === leave.staffId)?.lastName
        }));
      })
    ).subscribe({
      next: (mappedLeaves) => {
        this.pendingLeaves = mappedLeaves.filter(request => request.status === 'HR Review');;
      },
      error: (error) => {
        console.error('Error loading leaves data', error);
        // Handle errors here
      }
    });
  }


  loadLeaveDetails(leaveId: string) {
    // Find the leave in the pendingLeaves array
    const leave = this.pendingLeaves.find(l => l._id === leaveId);
    if (leave) {
      this.selectedLeave = leave;
      this.openModal();
    } else {
      this.toastr.error('Error fetching leave details', 'Error');
    }
  }


  approveLeave(leave: Leave) {
    if (confirm('Are you sure you want to approve this leave request?')) {
      const updatedLeave = {
        ...leave,
        status: 'Approved',
        approverComments: this.selectedLeave.approverComments,
        approvedBy:this.user.staffId,
        approvedOn: new Date()
      };
      this.leavesService.updateLeave(leave._id, updatedLeave).subscribe(
        () => {
          this.toastr.success('Leave Approved', 'Success');
          this.fetchPendingLeaves();
          this.closeModal();
          this.router.navigate(['/leave-approval']);

        },
        error => this.toastr.error('Error Occurred', 'Error')
      );
    }
  }


  rejectLeave(leave: Leave) {
    if (confirm('Are you sure you want to reject this leave request?')) {
      const updatedLeave = {
        ...leave,
        status: 'Rejected',
        approverComments: this.selectedLeave.approverComments,
        approvedBy: this.user.staffId,
        approvedOn: new Date()
      };
      this.leavesService.updateLeave(leave._id, updatedLeave).subscribe(
        () => {
          this.toastr.error('Leave Rejected', 'Error');
          this.fetchPendingLeaves();
          this.closeModal();
        },
        error => this.toastr.error('Error Occurred', 'Error')
      );
    }
  }


  openModal() {
    const modalElement = this.leaveDetailsModal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  closeModal() {
    this.selectedLeave = null;
    const modalElement = this.leaveDetailsModal.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
  }
}
