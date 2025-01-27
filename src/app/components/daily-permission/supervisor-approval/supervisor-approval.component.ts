import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { DailyPermission } from 'src/app/models/daily-permission.model';
import { Employee } from 'src/app/models/employee.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';
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
  user: any; // Logged-in user details

  constructor(private permissionRequestService: DailyPermissionService,
    private employeeService: EmployeeService,private userProfileService: UserProfileService,
    private toastr: ToastrService,private departmentService: DepartmentService) {}

  ngOnInit(): void {
    // this.loadPendingRequests();
    this.loadAllEmployees();

    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData) {
          this.user = userData; // Get the logged-in user's details
          this.loadPermissionRequests(); // Load requests based on the user's role
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  // loadPermissionRequests() {
  //   forkJoin({
  //     permissions: this.permissionRequestService.getAllPermissions(),
  //     employees: this.employeeService.getAllEmployees(),
  //     departments: this.departmentService.getDepartments() // Add departments for filtering
  //   })
  //     .pipe(
  //       map(({ permissions, employees, departments }) => {
  //         return permissions.map(permission => {
  //           const employee = employees.find(emp => emp.staffId === permission.staffId);

  //           let employeeDepartmentName = 'Unknown Department';
  //           let employeeDepartmentId = null;

  //           if (employee) {
  //             const employeeDepartment = departments.find(dept => {
  //               return dept._id.toString() === employee.department.toString();
  //             });

  //             if (employeeDepartment) {
  //               employeeDepartmentName = employeeDepartment.name;
  //               employeeDepartmentId = employeeDepartment._id;
  //             }
  //           }

  //           return {
  //             ...permission,
  //             employeeName: `${employee?.firstName || 'Unknown'} ${employee?.lastName || ''}`,
  //             department: employeeDepartmentName,
  //             departmentId: employeeDepartmentId || 'Unknown Department'
  //           };
  //         });
  //       })
  //     )
  //     .subscribe({
  //       next: (mappedPermissions) => {
  //         if (this.user) {
  //           if (this.user.role === 'admin') {
  //             // Admins see all pending requests
  //             this.pendingRequests = mappedPermissions.filter(request => request.status === 'Pending');
  //           } else if (this.user.role === 'manager') {
  //             // Managers see pending requests for their department
  //             this.pendingRequests = mappedPermissions.filter(request => {
  //               const isSameDepartment = request.departmentId === this.user.department;
  //               const isPending = request.status === 'Pending';
  //               return isSameDepartment && isPending;
  //             });
  //           }
  //         } else {
  //           // Fallback: Show all pending requests
  //           this.pendingRequests = mappedPermissions.filter(request => request.status === 'Pending');
  //           console.warn('User not defined. Showing all pending requests.');
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error loading permission requests:', error);
  //       }
  //     });
  // }

  // loadPendingRequests() {
  //   this.permissionRequestService.getAllPermissions().subscribe(
  //     requests => {
  //       this.pendingRequests = requests.filter(request => request.status === 'Pending');
  //     },
  //     error => {
  //       console.error('Error loading permission requests:', error);
  //       // Handle the error appropriately
  //     }
  //   );
  // }

  loadPermissionRequests() {
    forkJoin({
      permissions: this.permissionRequestService.getAllPermissions(),
      employees: this.employeeService.getAllEmployees(),
      departments: this.departmentService.getDepartments() // Include departments for department-based filtering
    })
      .pipe(
        map(({ permissions, employees, departments }) => {
          return permissions.map(permission => {
            // Find the corresponding employee
            const employee = employees.find(emp => emp.staffId === permission.staffId);
  
            // Determine the employee's department name and ID
            let employeeDepartmentName = 'Unknown Department';
            let employeeDepartmentId = null;
  
            if (employee) {
              const employeeDepartment = departments.find(dept => dept._id.toString() === employee.department?.toString());
              if (employeeDepartment) {
                employeeDepartmentName = employeeDepartment.name;
                employeeDepartmentId = employeeDepartment._id;
              }
            }
  
            // Return enriched permission request with employee details, including role
            return {
              ...permission,
              employeeName: `${employee?.firstName || 'Unknown'} ${employee?.lastName || ''}`,
              department: employeeDepartmentName,
              departmentId: employeeDepartmentId || 'Unknown Department'
            };
          });
        })
      )
      .subscribe({
        next: (mappedPermissions) => {
          if (this.user) {
            if (this.user.role === 'admin') {
              // Admins see all pending requests
              this.pendingRequests = mappedPermissions.filter(request => request.status === 'Pending');
            } else if (this.user.role === 'manager') {
              // Managers see pending requests for their department
              this.pendingRequests = mappedPermissions.filter(request => {
                const isSameDepartment = request.departmentId === this.user.department;
                const isPending = request.status === 'Pending';
                return isSameDepartment && isPending;
              });
            } else if (this.user.role === 'employee') {
              // Employees see only their own pending requests
              this.pendingRequests = mappedPermissions.filter(request => {
                const isOwnRequest = request.staffId === this.user.staffId;
                const isPending = request.status === 'Pending';
                return isOwnRequest && isPending;
              });
            }
          } else {
            // Fallback: Show all pending requests
            this.pendingRequests = mappedPermissions.filter(request => request.status === 'Pending');
            console.warn('User not defined. Showing all pending requests.');
          }
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
                this.loadPermissionRequests(); // Refresh the list
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
                this.loadPermissionRequests(); // Refresh the list
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
