import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DailyPermission } from 'src/app/models/daily-permission.model';
import { Employee } from 'src/app/models/employee.model';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';

@Component({
  selector: 'app-supervisor-approval',
  templateUrl: './supervisor-approval.component.html',
  styleUrls: ['./supervisor-approval.component.css']
})
export class SupervisorApprovalComponent implements OnInit {

  selectedRequest: DailyPermission | null = null;
  @ViewChild('requestModal') requestModal: ElementRef;

  pendingRequests: DailyPermission[] = [];
  employees: Employee[] = [];

  constructor(private permissionRequestService: DailyPermissionService,
    private employeeService: EmployeeService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadPendingRequests();
    this.loadAllEmployees();
  }

  loadPendingRequests() {
    this.permissionRequestService.getAllPermissions().subscribe(
      requests => {
        this.pendingRequests = requests.filter(request => request.status === 'Pending');
      },
      error => {
        console.error('Error loading permission requests:', error);
        // Handle the error appropriately
      }
    );
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


  openRequestModal() {
    // Defer opening the modal to the next event loop cycle
    setTimeout(() => {
      if (this.selectedRequest && this.requestModal && this.requestModal.nativeElement) {
        const modalElement = this.requestModal.nativeElement;
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
      } else {
        console.error('Modal or selectedRequest is not available');
      }
    });
  }


  closeModal() {
    const modalElement = this.requestModal.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
  }

  approveRequest(requestId: string, comments?: string) {
    if (this.selectedRequest) {
      const confirmation = confirm('Are you sure you want to Approve this request?');
      if (confirmation) {
        this.permissionRequestService.getPermissionById(requestId).subscribe(
          (permission) => {
            const updatedPermission: DailyPermission = {
              ...permission,
              status: 'Approved' as 'Approved', // Explicitly typing as 'Approved'
              supervisorComments: comments,
              approvedBy: 'Manager', // Replace with actual approver's user ID
              approvedOn: new Date()
            };
            this.permissionRequestService.updatePermission(requestId, updatedPermission).subscribe(
              () => {
                this.toastr.success('Request Approved', 'Success');
                this.loadPendingRequests(); // Refresh the list
                this.closeModal();
              },
              (error) => {
                console.error('Error approving request:', error);
                this.toastr.error('Error processing request', 'Error');
              }
            );
          },
          (error) => {
            console.error('Error fetching permission:', error);
          }
        );
      }
    }
  }

  rejectRequest(requestId: string, comments?: string ) {
    if (this.selectedRequest) {
      const confirmation = confirm('Are you sure you want to Reject this request?');
      if (confirmation) {
        this.permissionRequestService.getPermissionById(requestId).subscribe(
          (permission) => {
            const updatedPermission: DailyPermission = {
              ...permission,
              status: 'Rejected' as 'Rejected',
              supervisorComments: comments,
              approvedBy: 'Manager', // Replace with actual approver's user ID
              approvedOn: new Date()
            };
            this.permissionRequestService.updatePermission(requestId, updatedPermission).subscribe(
              () => {
                this.toastr.error('Request Rejected', 'Rejected');
                this.loadPendingRequests(); // Refresh the list
                this.closeModal();
              },
              (error) => {
                console.error('Error rejecting request:', error);
                this.toastr.error('Error processing request', 'Error');
              }
            );
          },
          (error) => {
            console.error('Error fetching permission:', error);
          }
        );
      }
    }
  }


  loadPermissionDetails(permissionId: string) {
    this.permissionRequestService.getPermissionById(permissionId).subscribe(
      request => {
        this.selectedRequest = request;
        this.openRequestModal();
      },
      error => {
        this.toastr.error('Error fetching leave details', 'Error');
        console.error('Error fetching leave details:', error);
      }
    );
  }


}
