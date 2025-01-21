import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CountsService {
  private countsSubject = new BehaviorSubject<any>(null);
  counts$ = this.countsSubject.asObservable();

  constructor(
    private leavesService: LeavesService,
    private requestService: RequestService,
    private vehicleRequestService: VehicleRequestService,
    private permissionRequestService: DailyPermissionService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  initializeCounts(): void {
    const userData = this.authService.getCurrentUserData();
    const userRole = userData?.role || 'Employee';
    const userDepartment = userData?.department || null;

    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      funds: this.requestService.getAllRequestRecords(),
      vehicles: this.vehicleRequestService.getRequests(),
      permissions: this.permissionRequestService.getAllPermissions(),
      employees: this.employeeService.getAllEmployees(),
    })
      .pipe(
        map(({ leaves, funds, vehicles, permissions, employees }) => {
          // Leaves Count
          const leavesWithDepartments = leaves.map((leave) => {
            const employee = employees.find((emp) => emp.staffId === leave.staffId);
            return {
              ...leave,
              departmentId: employee?.department || null,
            };
          });

          const pendingLeaveCount = userRole === 'manager'
            ? leavesWithDepartments.filter((leave) => leave.status === 'Pending' && leave.departmentId === userDepartment).length
            : leaves.filter((leave) => leave.status === 'Pending').length;

          const managerReviewLeaveCount = leaves.filter((leave) => leave.status === 'Manager Review').length;
          const hRReviewLeaveCount = leaves.filter((leave) => leave.status === 'Finance Review').length;
          const directorReviewLeaveCount = leaves.filter((leave) => leave.status === 'HR Review').length;

          // Funds Count
          const fundsWithDepartments = funds.map((fund) => {
            const employee = employees.find((emp) => emp.staffId === fund.staffId);
            return {
              ...fund,
              departmentId: employee?.department || null,
            };
          });

          const pendingFundsCount = userRole === 'manager'
            ? fundsWithDepartments.filter((fund) => fund.status === 'Pending' && fund.departmentId === userDepartment).length
            : funds.filter((fund) => fund.status === 'Pending').length;

          const mandeReviewCount = funds.filter((fund) => fund.status === 'ManagerReview').length;
          const financeReviewFundsCount = funds.filter((fund) => fund.status === 'M&EReview').length;
          const directorReviewFundsCount = funds.filter((fund) => fund.status === 'Reviewed').length;

          // Vehicle Requests Count
          const vehicleRequests = vehicles.filter((vehicle) => vehicle.status === 'Pending').length;

          // Permissions Count
          const pendingPermissionRequestsCount = permissions.filter((permission) => {
            if (userRole === 'admin') {
              return permission.status === 'Pending';
            } else if (userRole === 'manager') {
              const employee = employees.find((emp) => emp.staffId === permission.staffId);
              return permission.status === 'Pending' && employee?.department === userDepartment;
            }
            return false;
          }).length;

          return {
            pendingLeaveCount,
            managerReviewLeaveCount,
            hRReviewLeaveCount,
            directorReviewLeaveCount,
            pendingFundsCount,
            mandeReviewCount,
            financeReviewFundsCount,
            directorReviewFundsCount,
            vehicleRequests,
            pendingPermissionRequestsCount,
          };
        })
      )
      .subscribe({
        next: (counts) => this.countsSubject.next(counts),
        error: (err) => console.error('Error fetching counts:', err),
      });
  }
}
