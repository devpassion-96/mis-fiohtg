import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DailyPermission } from 'src/app/models/daily-permission.model';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-daily-permission-list',
  templateUrl: './daily-permission-list.component.html',
  styleUrls: ['./daily-permission-list.component.css']
})
export class DailyPermissionListComponent {

  selectedRequest: DailyPermission | null = null;
  @ViewChild('requestModal') requestModal: ElementRef;

  pendingRequests: DailyPermission[] = [];
  employees: Employee[] = [];

    userRole: string; // Admin, Manager, or Employee
userDepartment: string; // Department for managers
userStaffId: string; // Staff ID for employees

itemsPerPage: number = 10;
p: number = 1;

  constructor(private permissionRequestService: DailyPermissionService,
    private employeeService: EmployeeService,private authService: AuthService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadPendingRequests();
    this.loadAllEmployees();
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

  // loadPendingRequests() {
  //   this.permissionRequestService.getAllPermissions().subscribe(
  //     requests => {
  //       this.pendingRequests = requests;
  //     },
  //     error => {
  //       console.error('Error loading permission requests:', error);
  //       // Handle the error appropriately
  //     }
  //   );
  // }

  loadPendingRequests() {
    forkJoin({
      requests: this.permissionRequestService.getAllPermissions(),
      employees: this.employeeService.getAllEmployees()
    })
      .pipe(
        map(({ requests, employees }) => {
          // Enrich permission requests with employee details
          const enrichedRequests = requests.map(request => ({
            ...request,
            employeeName: employees.find(emp => emp.staffId === request.staffId)?.firstName + ' ' +
                          employees.find(emp => emp.staffId === request.staffId)?.lastName || 'Unknown'
          }));
  
          // Apply role-based filtering
          if (this.userRole === 'admin') {
            return enrichedRequests; // Admin sees all requests
          } else if (this.userRole === 'manager') {
            return enrichedRequests.filter(request =>
              employees.find(emp => emp.staffId === request.staffId)?.department === this.userDepartment
            ); // Manager sees requests from their department
          } else if (this.userRole === 'employee') {
            return enrichedRequests.filter(request => request.staffId === this.userStaffId); // Employee sees only their own requests
          }
  
          return []; // Default to an empty list if no role matches
        })
      )
      .subscribe({
        next: (filteredRequests) => {
          this.pendingRequests = filteredRequests; // Store filtered requests
        },
        error: (error) => {
          console.error('Error loading permission requests:', error);
          this.toastr.error('Error loading permission requests', 'Error');
        }
      });
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
