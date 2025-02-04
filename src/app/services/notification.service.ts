// import { Injectable } from '@angular/core';
// import { forkJoin, BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { LeavesService } from 'src/app/services/hrm/leaves.service';
// import { RequestService } from 'src/app/services/hrm/request.service';
// import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
// import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
// import { EmployeeService } from 'src/app/services/hrm/employee.service';
// import { AuthService } from 'src/app/services/auth/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class CountsService {
//   private countsSubject = new BehaviorSubject<any>(null);
//   counts$ = this.countsSubject.asObservable();

//   constructor(
//     private leavesService: LeavesService,
//     private requestService: RequestService,
//     private vehicleRequestService: VehicleRequestService,
//     private permissionRequestService: DailyPermissionService,
//     private employeeService: EmployeeService,
//     private authService: AuthService
//   ) {}

//   initializeCounts(): void {
//     const userData = this.authService.getCurrentUserData();
//     const userRole = userData?.role || 'Employee';
//     const userDepartment = userData?.department || null;

//     forkJoin({
//       leaves: this.leavesService.getAllLeaves(),
//       funds: this.requestService.getAllRequestRecords(),
//       vehicles: this.vehicleRequestService.getRequests(),
//       permissions: this.permissionRequestService.getAllPermissions(),
//       employees: this.employeeService.getAllEmployees(),
//     })
//       .pipe(
//         map(({ leaves, funds, vehicles, permissions, employees }) => {
//           // Leaves Count
//           const leavesWithDepartments = leaves.map((leave) => {
//             const employee = employees.find((emp) => emp.staffId === leave.staffId);
//             return {
//               ...leave,
//               departmentId: employee?.department || null,
//             };
//           });

//           const pendingLeaveCount = userRole === 'manager'
//             ? leavesWithDepartments.filter((leave) => leave.status === 'Pending' && leave.departmentId === userDepartment).length
//             : leaves.filter((leave) => leave.status === 'Pending').length;

//           const managerReviewLeaveCount = leaves.filter((leave) => leave.status === 'Manager Review').length;
//           const hRReviewLeaveCount = leaves.filter((leave) => leave.status === 'Finance Review').length;
//           const directorReviewLeaveCount = leaves.filter((leave) => leave.status === 'HR Review').length;

//           // Funds Count
//           const fundsWithDepartments = funds.map((fund) => {
//             const employee = employees.find((emp) => emp.staffId === fund.staffId);
//             return {
//               ...fund,
//               departmentId: employee?.department || null,
//             };
//           });

//           const pendingFundsCount = userRole === 'manager'
//             ? fundsWithDepartments.filter((fund) => fund.status === 'Pending' && fund.departmentId === userDepartment).length
//             : funds.filter((fund) => fund.status === 'Pending').length;

//           const mandeReviewCount = funds.filter((fund) => fund.status === 'ManagerReview').length;
//           const financeReviewFundsCount = funds.filter((fund) => fund.status === 'M&EReview').length;
//           const directorReviewFundsCount = funds.filter((fund) => fund.status === 'Reviewed').length;

//           // Vehicle Requests Count
//           const vehicleRequests = vehicles.filter((vehicle) => vehicle.status === 'Pending').length;

//           // Permissions Count
//           const pendingPermissionRequestsCount = permissions.filter((permission) => {
//             if (userRole === 'admin') {
//               return permission.status === 'Pending';
//             } else if (userRole === 'manager') {
//               const employee = employees.find((emp) => emp.staffId === permission.staffId);
//               return permission.status === 'Pending' && employee?.department === userDepartment;
//             }
//             return false;
//           }).length;

//           return {
//             pendingLeaveCount,
//             managerReviewLeaveCount,
//             hRReviewLeaveCount,
//             directorReviewLeaveCount,
//             pendingFundsCount,
//             mandeReviewCount,
//             financeReviewFundsCount,
//             directorReviewFundsCount,
//             vehicleRequests,
//             pendingPermissionRequestsCount,
//           };
//         })
//       )
//       .subscribe({
//         next: (counts) => this.countsSubject.next(counts),
//         error: (err) => console.error('Error fetching counts:', err),
//       });
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { LeavesService } from '../services/hrm/leaves.service';
import { RequestService } from '../services/hrm/request.service';
import { VehicleRequestService } from '../services/vehicle-drivers/vehicle-request.service';
import { DailyPermissionService } from '../services/hrm/daily-permission.service';
import { EmployeeService } from '../services/hrm/employee.service';
import { DepartmentService } from '../services/hrm/department.service';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountsService {
  private countsSubject = new BehaviorSubject<any>({});
  counts$ = this.countsSubject.asObservable();

  userRole: string;
  userStaffId: string;
  userDepartmentId: string;
  userDesignation: string;

  constructor(
    private leavesService: LeavesService,
    private requestService: RequestService,
    private vehicleRequestService: VehicleRequestService,
    private permissionService: DailyPermissionService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  initializeCounts() {
    const userData = this.authService.getCurrentUserData();
    this.userRole = userData?.role || 'Employee';
    this.userStaffId = userData?.staffId;
    this.userDepartmentId = userData?.department || '';

    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      funds: this.requestService.getAllRequestRecords(),
      vehicles: this.vehicleRequestService.getRequests(),
      permissions: this.permissionService.getAllPermissions(),
      employees: this.employeeService.getAllEmployees(),
      departments: this.departmentService.getDepartments()
    })
      .pipe(
        map(({ leaves, funds, vehicles, permissions, employees, departments }) => {
          // 🔍 Find the current user
          const currentUser = employees.find(emp => emp.staffId === this.userStaffId);
          if (!currentUser) return {}; // If user details are missing, return empty

          // 🏢 Get user's department
          const userDepartment = departments.find(dept => dept._id === currentUser.department);
          if (!userDepartment) return {}; // If department not found, return empty

          // 🏷️ Get user's designation from department
          this.userDesignation = userDepartment.designations.find(
            des => des.title.toLowerCase() === currentUser.designation.toLowerCase()
          )?.title;

          // 🛠 Apply role-based filtering
          const filteredLeaves = this.filterLeavesByRole(leaves, employees, currentUser, userDepartment);
          const filteredFunds = this.filterFundsByRole(funds, employees, currentUser, userDepartment);
          const filteredVehicles = this.filterVehiclesByRole(vehicles);
          const filteredPermissions = this.filterPermissionsByRole(permissions, employees, departments, currentUser);

          return {

    //         pendingLeaveCount: filteredLeaves.filter(leave => leave.status === 'Pending').length,
    // managerReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'Manager Review').length,
    // hRReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'Finance Review').length,
    // directorReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'HR Review').length,

    pendingLeaveCount: filteredLeaves.filter(leave => leave.status === 'Pending').length,
    managerReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'Pending').length,
    financeReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'Manager Review').length,
    hRReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'Finance Review').length,
    directorReviewLeaveCount: filteredLeaves.filter(leave => leave.status === 'HR Review').length,


            pendingFundsCount: filteredFunds.filter(fund => fund.status === 'Pending').length,
            mandeReviewCount: filteredFunds.filter(fund => fund.status === 'ManagerReview').length,
            financeReviewFundsCount: filteredFunds.filter(fund => fund.status === 'M&EReview').length,
            directorReviewFundsCount: filteredFunds.filter(fund => fund.status === 'Reviewed').length,

            vehicleRequests: filteredVehicles.length,
            pendingPermissionRequestsCount: filteredPermissions.length
          };
        })
      )
      .subscribe({
        next: (counts) => this.countsSubject.next(counts),
        error: (err) => console.error('Error fetching counts:', err)
      });
  }

  // 🚀 Helper Functions to Filter Data by Role

  // private filterLeavesByRole(leaves, employees, currentUser, userDepartment) {
  //   if (this.userRole === 'admin') {
  //     return leaves; // ✅ Admin sees all leaves
  //   } else if (this.userRole === 'manager') {
  //     if (userDepartment.name.toLowerCase() === 'finance' &&
  //         ['finance manager', 'finance assistant'].includes(this.userDesignation?.toLowerCase())) {
  //       return leaves; // ✅ Finance managers see all leaves
  //     }
  //     return leaves.filter(leave => employees.find(emp => emp.staffId === leave.staffId)?.department === currentUser.department);
  //   } else {
  //     return leaves.filter(leave => leave.staffId === this.userStaffId); // ✅ Employees see only their own leaves
  //   }
  // }

  private filterLeavesByRole(leaves, employees, currentUser, userDepartment) {
    if (this.userRole === 'admin') {
        return leaves; // ✅ Admin sees all leaves
    } else if (this.userRole === 'manager') {
        if (
            userDepartment.name.toLowerCase() === 'finance' &&
            ['finance manager', 'finance assistant'].includes(this.userDesignation?.toLowerCase())
        ) {
            return leaves; // ✅ Finance managers see all leaves
        }

        // Managers should only see leaves from their own department
        return leaves.filter(leave => {
            const leaveEmployee = employees.find(emp => emp.staffId === leave.staffId);
            return leaveEmployee && leaveEmployee.department === currentUser.department;
        });
    } else {
        return leaves.filter(leave => leave.staffId === this.userStaffId); // ✅ Employees see only their own leaves
    }
}


  private filterFundsByRole(funds, employees, currentUser, userDepartment) {
    if (this.userRole === 'admin') {
      return funds; // ✅ Admin sees all funds
    } else if (this.userRole === 'manager') {
      if (userDepartment.name.toLowerCase() === 'finance' &&
          ['finance manager', 'finance assistant'].includes(this.userDesignation?.toLowerCase())) {
        return funds; // ✅ Finance managers see all funds
      }
      return funds.filter(fund => employees.find(emp => emp.staffId === fund.staffId)?.department === currentUser.department);
    } else {
      return funds.filter(fund => fund.staffId === this.userStaffId); // ✅ Employees see only their own requests
    }
  }

  private filterVehiclesByRole(vehicles) {
    if (this.userRole === 'admin') {
      return vehicles.filter(vehicle => vehicle.status === 'Pending'); // ✅ Admin sees pending requests
    } else if (this.userRole === 'manager') {
      return vehicles.filter(vehicle => vehicle.status === 'Pending'); // ✅ Managers also see pending requests
    }
    return []; // ❌ Employees don't see vehicle requests
  }

  private filterPermissionsByRole(permissions, employees, departments, currentUser) {
    return permissions.map(permission => {
      const employee = employees.find(emp => emp.staffId === permission.staffId);
      const employeeDepartmentId = employee 
        ? departments.find(dept => dept._id.toString() === employee.department.toString())?._id 
        : null;

      return {
        ...permission,
        departmentId: employeeDepartmentId || 'Unknown'
      };
    }).filter(request => 
      this.userRole === 'admin' ? request.status === 'Pending' 
      : this.userRole === 'manager' && request.departmentId === currentUser.department
    );
  }
}

