import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { jwtDecode } from 'jwt-decode';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { forkJoin, map } from 'rxjs';
import { DepartmentService } from 'src/app/services/hrm/department.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // user: any;
  userRole: string;
  requests: Request[] = [];

  userDepartment: string;
  userStaffId: string;
  allDepartments: any[] = [];
  selectedDesignations: string[] = []; // Designations for access control

  private apiUrl = `${environment.apiUrl}/auth/profile`;
  // Use BehaviorSubject to store and emit user data
  private userSubject = new BehaviorSubject<any>(null);
  // user = this.userSubject.asObservable();

  user$: Observable<any>; // Observable for user

    // get leaves counts
    allLeavesCount;
    pendingLeaveCount;
    approvedLeaveCount;
    rejectedLeaveCount;
    managerReviewLeaveCount: number = 0;
    hRReviewLeaveCount: number = 0;
    directorReviewLeaveCount: number = 0;

    // get fund request counts

    pendingFundsCount: number = 0; // Count of pending funds
    mandeReviewCount: number = 0; // Count for manager review
    financeReviewFundsCount: number = 0; // Count for HR review
    directorReviewFundsCount: number = 0; // Count for director review

  constructor(private http: HttpClient,private leavesService: LeavesService,
    private requestService: RequestService,private permissionRequestService: DailyPermissionService,
    private projectService: ProjectService,private departmentService: DepartmentService,
    private vehicleRequestService: VehicleRequestService,
    private employeeService: EmployeeService, public authService: AuthService, private router: Router,private userProfileService: UserProfileService) { }

    ngOnInit() {
      // Assign the observable directly
      this.user$ = this.userProfileService.user;
    
      // Fetch the user profile and initialize
      this.userProfileService.getUserProfile();
      this.initializeCounts();
      this.initializeFundRequestCounts();
      this.loadVehicleRequests();
      this.loadPermissionRequests(); // Fetch pending permission request count
      this.fetchDepartmentsAndDesignations();
    }

    initializeCounts() {
      // Load user role first
      this.loadUserRole();
    
      // Load all leaves and calculate counts in one API call
      forkJoin({
        leaves: this.leavesService.getAllLeaves(),
        employees: this.employeeService.getAllEmployees(),
      })
        .pipe(
          map(({ leaves, employees }) => {
            return {
              leaves,
              leavesWithDepartments: leaves.map((leave) => {
                const employee = employees.find((emp) => emp.staffId === leave.staffId);
                return {
                  ...leave,
                  departmentId: employee?.department || null, // Associate departmentId
                };
              }),
            };
          })
        )
        .subscribe({
          next: ({ leaves, leavesWithDepartments }) => {
            // Calculate counts
            this.calculatePendingLeaveCount(leavesWithDepartments);
            this.managerReviewLeaveCount = this.calculateLeaveCountByStatus(leaves, 'Manager Review');
            this.hRReviewLeaveCount = this.calculateLeaveCountByStatus(leaves, 'Finance Review');
            this.directorReviewLeaveCount = this.calculateLeaveCountByStatus(leaves, 'HR Review');
          },
          error: (err) => {
            console.error('Error fetching leaves data:', err);
          },
        });
    }

    initializeFundRequestCounts() {
      // Load user role and related information
      this.loadUserRole();
  
      // Load all funds and calculate counts in one API call
      forkJoin({
        funds: this.requestService.getAllRequestRecords(),
        employees: this.employeeService.getAllEmployees()
      })
        .pipe(
          map(({ funds, employees }) => {
            return {
              funds,
              fundsWithDepartments: funds.map((fund) => {
                const employee = employees.find((emp) => emp.staffId === fund.staffId);
                return {
                  ...fund,
                  departmentId: employee?.department || null // Associate departmentId
                };
              })
            };
          })
        )
        .subscribe({
          next: ({ funds, fundsWithDepartments }) => {
            // Calculate counts
            this.calculatePendingFundsCount(fundsWithDepartments);
            this.mandeReviewCount = this.calculateFundsCountByStatus(
              funds,
              'ManagerReview'
            );
            this.financeReviewFundsCount = this.calculateFundsCountByStatus(
              funds,
              'M&EReview'
            );
            this.directorReviewFundsCount = this.calculateFundsCountByStatus(
              funds,
              'Reviewed'
            );
          },
          error: (err) => {
            console.error('Error fetching funds data:', err);
          }
        });
    }

    userDepartmentName;
    userDesignation;
//    loadUserRole() {
//   const userData = this.authService.getCurrentUserData();
//   if (userData) {
//     this.userRole = userData.role; // Role of the user (e.g., "manager")
//     this.userDepartment = userData.department; // Department ID
//     this.userStaffId = userData.staffId; // Staff ID for employees

//     // Fetch the department details using the department ID
//     this.departmentService.getDepartmentById(this.userDepartment).subscribe({
//       next: (department) => {
//         if (department) {
//           this.userDepartmentName = department.name; // Save the department name
//           this.userDesignation = department.designations.find(
//             (designation) => designation.title.toLowerCase() === this.userRole.toLowerCase()
//           )?.title; // Match the role with the department's designations

      
//         } else {
//           this.userDepartmentName = null;
//           this.userDesignation = null;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching department details:', err);
//         this.userDepartmentName = null;
//         this.userDesignation = null;
//       },
//     });
//   } else {
//     this.userRole = 'Employee';
//     this.userDepartmentName = null;
//     this.userDesignation = null;
//   }
// }

loadUserRole() {
  const userData = this.authService.getCurrentUserData();
  console.log('User Data:', userData); // Debugging line

  this.userRole = userData.role;

  if (userData) {
    this.userDepartment = userData.department; // Get department ID
    this.userStaffId = userData.staffId; // Get employee Staff ID

    console.log('User Department ID:', this.userDepartment);
    console.log('User Staff ID:', this.userStaffId);

    // Fetch employee details based on staff ID
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        const employee = employees.find(emp => emp.staffId === this.userStaffId);

        if (employee) {
          this.userDesignation = employee.designation; // Get designation from employees table
          console.log('User Designation from Employee Table:', this.userDesignation);
        } else {
          console.warn('Employee not found for Staff ID:', this.userStaffId);
          this.userDesignation = null;
        }

        // Now fetch department details
        this.departmentService.getDepartmentById(this.userDepartment).subscribe({
          next: (department) => {
            if (department) {
              console.log('Department Data:', department);

              this.userDepartmentName = department.name; // Store department name

              // Check if the user's designation exists in the department
              const matchingDesignation = department.designations.find(
                (designation) => designation.title.toLowerCase() === this.userDesignation?.toLowerCase()
              );

              if (matchingDesignation) {
                this.userDesignation = matchingDesignation.title;
                console.log('Matching Designation Found:', this.userDesignation);
              } else {
                console.warn('No matching designation found in department');
                this.userDesignation = null;
              }
            } else {
              this.userDepartmentName = null;
              this.userDesignation = null;
            }
          },
          error: (err) => {
            console.error('Error fetching department details:', err);
            this.userDepartmentName = null;
            this.userDesignation = null;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
    });
  } else {
    this.userDepartmentName = null;
    this.userDesignation = null;
  }
}



    

    fetchDepartmentsAndDesignations() {
      this.departmentService.getDepartments().subscribe({
        next: (departments) => {
          this.allDepartments = departments; // Store departments and their designations
        },
        error: (err) => {
          console.error('Error fetching departments and designations:', err);
        },
      });
    }
    

    canAccessDepartmentWithDesignations(departmentName: string): boolean {
      // Find the department by name
      const department = this.allDepartments.find(
        (dept) => dept.name.toLowerCase() === departmentName.toLowerCase()
      );
    
      if (!department) {
        return false; // Deny access if the department is not found
      }
    
      // Check if the user's designation matches any of the department's designations
      const isDesignationMatching = department.designations.some(
        (designation) => designation.title.toLowerCase() === this.userDesignation?.toLowerCase()
      );
    
      // Return true only if both the department matches and the designation matches
      return isDesignationMatching;
    }
    
    
    
    
    

// Helper for granular access control

canAccess(departmentDesignationPairs: { department: string; designations: string[] }[]): boolean {
  // If the user is an admin, grant full access
  if (this.userRole?.toLowerCase() === 'admin') {
    console.log('Admin access granted to all.');
    return true;
  }

  // Normal access logic for other users
  const result = departmentDesignationPairs.some(({ department, designations }) => {
    // Check if the department matches
    const departmentData = this.allDepartments.find(
      (dept) => dept.name.toLowerCase() === department.toLowerCase()
    );

    if (!departmentData) {
      return false; // Deny access if department doesn't exist
    }

    // Check if any of the provided designations match the user's designation
    const isDesignationMatching = designations.some(
      (designation) => designation.toLowerCase() === this.userDesignation?.toLowerCase()
    );

    // Grant access only if the department matches and the designation matches
    return (
      departmentData.name.toLowerCase() === this.userDepartmentName?.toLowerCase() &&
      isDesignationMatching
    );
  });
  return result;
}

  
    
    // Calculate pending leave count for managers
    calculatePendingLeaveCount(leavesWithDepartments: any[]) {
      if (this.userRole === 'manager') {
        const filteredLeaves = leavesWithDepartments.filter(
          (leave) =>
            leave.status === 'Pending' && leave.departmentId === this.userDepartment
        );
        this.pendingLeaveCount = filteredLeaves.length;
      } else {
        this.pendingLeaveCount = 0; // Non-managers have no pending leave count
      }
    }

    calculatePendingFundsCount(fundsWithDepartments: any[]) {
      if (this.userRole === 'manager') {
        const filteredFunds = fundsWithDepartments.filter(
          (fund) =>
            fund.status === 'Pending' &&
            fund.departmentId === this.userDepartment
        );
        this.pendingFundsCount = filteredFunds.length;
      } else {
        this.pendingFundsCount = 0; // Non-managers have no pending funds count
      }
    }
    
    // Calculate leave count by status
    calculateLeaveCountByStatus(leaves: any[], status: string): number {
      return leaves.filter((leave) => leave.status === status).length;
    }

    calculateFundsCountByStatus(funds: any[], status: string): number {
      return funds.filter((fund) => fund.status === status).length;
    }


    // -------------fund requests-----------------------
    fundRequestCount;
    managerCount;
    getFundRequestsCount() {
      // Single API call to fetch all leaves
      this.requestService.getAllRequestRecords().subscribe({
        next: (data) => {
          this.fundRequestCount = data.length; // Total leaves count
          this.managerCount = data.filter(
            (fund) => fund.status == 'Pending'
          ).length; // Pending leaves count
         
        },
        error: (err) => {
          console.error('Error loading leaves', err);
        }
      });
    }

    // vehicle requests
    vehicleRequests
    loadVehicleRequests(): void {
      this.vehicleRequestService.getRequests().subscribe(data => {
        this.vehicleRequests = data.filter(
          (vehicle) => vehicle.status == 'Pending'
        ).length; 
      });
    }

    // daily permissions
    pendingPermissionRequestsCount: number = 0;

    loadPermissionRequests() {
      forkJoin({
        permissions: this.permissionRequestService.getAllPermissions(),
        employees: this.employeeService.getAllEmployees(),
        departments: this.departmentService.getDepartments()
      })
        .pipe(
          map(({ permissions, employees, departments }) => {
            return permissions.map(permission => {
              const employee = employees.find(emp => emp.staffId === permission.staffId);
              const employeeDepartmentId = employee 
                ? departments.find(dept => dept._id.toString() === employee.department.toString())?._id 
                : null;
    
              return {
                ...permission,
                departmentId: employeeDepartmentId || 'Unknown'
              };
            });
          })
        )
        .subscribe({
          next: (mappedPermissions) => {
            const pendingRequests = mappedPermissions.filter(request => {
              if (this.userRole === 'admin') {
                return request.status === 'Pending';
              } else if (this.userRole === 'manager') {
                return request.status === 'Pending' && request.departmentId === this.userDepartment;
              }
              return false;
            });
            this.pendingPermissionRequestsCount = pendingRequests.length;
          },
          error: (error) => {
            console.error('Error loading permission requests:', error);
          }
        });
    }
    

  requestsFn(){
    this.requestService.getAllRequestRecords().subscribe(data => {
      // this.requests = data;
      // this.filteredEmployees = data; // Initially, filtered list is the full list
    });

    // this.requests = mappedRequests.filter(request => request.status === 'M&EReview');;

  }
  

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.userSubject.next(null); // Emit null if no token
      return;
    }

    this.http.get(this.apiUrl).subscribe(
      (userData) => {
        this.userSubject.next(userData); // Emit user data
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        this.userSubject.next(null); // Clear user data on error
      }
    );
  }

  clearUser() {
    this.userSubject.next(null); // Clear user data on logout
  }




}


interface DecodedToken {
  role: string;
}
