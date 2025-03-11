import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userRole: string;
  userDepartment: string;
  userStaffId: string;
  userDesignation: string;
  userDepartmentName: string;
  allDepartments: any[] = [];

  // Leave request counts
  pendingLeaveCount = 0;
  managerReviewLeaveCount = 0;
  hRReviewLeaveCount = 0;
  directorReviewLeaveCount = 0;

  // Fund request counts
  pendingFundsCount = 0;
  mandeReviewCount = 0;
  financeReviewFundsCount = 0;
  directorReviewFundsCount = 0;

  // Other request counts
  pendingVehicleRequestsCount = 0;
  pendingPermissionRequestsCount = 0;

  constructor(
    private authService: AuthService,
    private leavesService: LeavesService,
    private requestService: RequestService,
    private employeeService: EmployeeService,
    private vehicleRequestService: VehicleRequestService,
    private permissionRequestService: DailyPermissionService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadUserRole();
    this.fetchDepartmentsAndDesignations();
    this.initializeCounts();
    this.initializeFundRequestCounts();
    this.loadVehicleRequests();
    this.loadPermissionRequests();
  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    this.userRole = userData.role;
    this.userDepartment = userData.department;
    this.userStaffId = userData.staffId;

    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        const employee = employees.find(emp => emp.staffId === this.userStaffId);
        this.userDesignation = employee?.designation || null;

        this.departmentService.getDepartmentById(this.userDepartment).subscribe({
          next: (department) => {
            this.userDepartmentName = department?.name || null;
          }
        });
      }
    });
  }

  fetchDepartmentsAndDesignations() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.allDepartments = departments;
      }
    });
  }

  initializeCounts() {
    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees(),
    })
      .pipe(
        map(({ leaves, employees }) => {
          return leaves.map((leave) => {
            const employee = employees.find(emp => emp.staffId === leave.staffId);
            return { ...leave, departmentId: employee?.department || null };
          });
        })
      )
      .subscribe({
        next: (leavesWithDepartments) => {
          this.calculatePendingLeaveCount(leavesWithDepartments);
          this.managerReviewLeaveCount = this.calculateLeaveCountByStatus(leavesWithDepartments, 'Manager Review');
          this.hRReviewLeaveCount = this.calculateLeaveCountByStatus(leavesWithDepartments, 'Finance Review');
          this.directorReviewLeaveCount = this.calculateLeaveCountByStatus(leavesWithDepartments, 'HR Review');
        }
      });
  }

  initializeFundRequestCounts() {
    forkJoin({
      funds: this.requestService.getAllRequestRecords(),
      employees: this.employeeService.getAllEmployees(),
    })
      .pipe(
        map(({ funds, employees }) => {
          return funds.map((fund) => {
            const employee = employees.find(emp => emp.staffId === fund.staffId);
            return { ...fund, departmentId: employee?.department || null };
          });
        })
      )
      .subscribe({
        next: (fundsWithDepartments) => {
          this.calculatePendingFundsCount(fundsWithDepartments);
          this.mandeReviewCount = this.calculateFundsCountByStatus(fundsWithDepartments, 'ManagerReview');
          this.financeReviewFundsCount = this.calculateFundsCountByStatus(fundsWithDepartments, 'M&EReview');
          this.directorReviewFundsCount = this.calculateFundsCountByStatus(fundsWithDepartments, 'Reviewed');
        }
      });
  }

  loadVehicleRequests() {
    this.vehicleRequestService.getRequests().subscribe(data => {
      this.pendingVehicleRequestsCount = data.filter(vehicle => vehicle.status === 'Pending').length;
    });
  }

  loadPermissionRequests() {
    forkJoin({
      permissions: this.permissionRequestService.getAllPermissions(),
      employees: this.employeeService.getAllEmployees(),
      departments: this.departmentService.getDepartments(),
    })
      .pipe(
        map(({ permissions, employees, departments }) => {
          return permissions.map(permission => {
            const employee = employees.find(emp => emp.staffId === permission.staffId);
            return { ...permission, departmentId: employee?.department || 'Unknown' };
          });
        })
      )
      .subscribe({
        next: (mappedPermissions) => {
          this.pendingPermissionRequestsCount = mappedPermissions.filter(request =>
            (this.userRole === 'admin' || (this.userRole === 'manager' && request.departmentId === this.userDepartment)) &&
            request.status === 'Pending'
          ).length;
        }
      });
  }

  calculatePendingLeaveCount(leavesWithDepartments: any[]) {
    if (this.userRole === 'admin') {
      // Admin sees all pending leave requests
      this.pendingLeaveCount = leavesWithDepartments.filter(leave => leave.status === 'Pending').length;
    } else if (this.userRole === 'manager') {
      // Manager sees only pending leave requests from their department
      this.pendingLeaveCount = leavesWithDepartments.filter(
        leave => leave.status === 'Pending' && leave.departmentId === this.userDepartment
      ).length;
    }
  }
  

  calculatePendingFundsCount(fundsWithDepartments: any[]) {
    if (this.userRole === 'admin') {
      // Admin sees all pending fund requests
      this.pendingFundsCount = fundsWithDepartments.filter(fund => fund.status === 'Pending').length;
    } else if (this.userRole === 'manager') {
      // Manager sees only pending fund requests from their department
      this.pendingFundsCount = fundsWithDepartments.filter(
        fund => fund.status === 'Pending' && fund.departmentId === this.userDepartment
      ).length;
    }
  }
  

  calculateLeaveCountByStatus(leaves: any[], status: string): number {
    return leaves.filter(leave => leave.status === status).length;
  }

  calculateFundsCountByStatus(funds: any[], status: string): number {
    return funds.filter(fund => fund.status === status).length;
  }

  canAccess(departmentDesignationPairs: { department: string; designations: string[] }[]): boolean {
    if (this.userRole?.toLowerCase() === 'admin') return true;

    return departmentDesignationPairs.some(({ department, designations }) => {
      const departmentData = this.allDepartments.find(dept => dept.name.toLowerCase() === department.toLowerCase());
      if (!departmentData) return false;

      return departmentData.name.toLowerCase() === this.userDepartmentName?.toLowerCase() &&
        designations.some(designation => designation.toLowerCase() === this.userDesignation?.toLowerCase());
    });
  }

  canAccessDirector(): boolean {
  
    return this.userDepartmentName?.toLowerCase() === 'directorate' &&
           this.userDesignation?.toLowerCase() === 'country director';
  }
  
}
