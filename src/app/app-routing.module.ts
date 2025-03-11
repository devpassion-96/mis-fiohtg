import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee/employee-detail/employee-detail.component';
import { LeaveApplicationComponent } from './components/leaves/leave-application/leave-application.component';
import { LeaveListComponent } from './components/leaves/leave-list/leave-list.component';
import { LeaveDetailsComponent } from './components/leaves/leave-details/leave-details.component';
import { LeaveEditComponent } from './components/leaves/leave-edit/leave-edit.component';
import { LeaveApprovalComponent } from './components/leaves/leave-approval/leave-approval.component';
import { TrainingScheduleComponent } from './components/trainings/training-schedule/training-schedule.component';
import { TrainingAddComponent } from './components/trainings/training-add/training-add.component';
import { EmployeeDevelopmentComponent } from './components/trainings/employee-development/employee-development.component';
import { DailyPermissionFormComponent } from './components/daily-permission/daily-permission-form/daily-permission-form.component';
import { SupervisorApprovalComponent } from './components/daily-permission/supervisor-approval/supervisor-approval.component';
import { PayrollDetailComponent } from './components/payroll/payroll-detail/payroll-detail.component';
import { PayrollAddComponent } from './components/payroll/payroll-add/payroll-add.component';
import { PayrollListComponent } from './components/payroll/payroll-list/payroll-list.component';
import { PayrollEditComponent } from './components/payroll/payroll-edit/payroll-edit.component';
import { PayrollReportComponent } from './components/payroll/payroll-report/payroll-report.component';
import { PayrollAdjustmentComponent } from './components/payroll/payroll-adjustment/payroll-adjustment.component';
import { DepartmentAddComponent } from './components/department/department-add/department-add.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { ProjectsListComponent } from './components/projects/projects-list/projects-list.component';
import { ProjectsFormComponent } from './components/projects/projects-form/projects-form.component';
import { ProjectsDetailsComponent } from './components/projects/projects-details/projects-details.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { BudgetFormComponent } from './components/budgets/budget-form/budget-form.component';
import { BudgetListComponent } from './components/budgets/budget-list/budget-list.component';
import { RequestFormComponent } from './components/fund-request/request-form/request-form.component';
import { RequestListComponent } from './components/fund-request/request-list/request-list.component';
import { RequestReviewComponent } from './components/fund-request/request-review/request-review.component';
import { PendingRequestsComponent } from './components/fund-request/pending-requests/pending-requests.component';
import { RequestApprovalComponent } from './components/fund-request/request-approval/request-approval.component';
import { ReviewedRequestsComponent } from './components/fund-request/reviewed-requests/reviewed-requests.component';
import { DriverFormComponent } from './components/vehicle-and-drivers/driver/driver-form/driver-form.component';
import { DriverListComponent } from './components/vehicle-and-drivers/driver/driver-list/driver-list.component';
import { DriverDetailComponent } from './components/vehicle-and-drivers/driver/driver-detail/driver-detail.component';
import { VehicleFormComponent } from './components/vehicle-and-drivers/vehicles/vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './components/vehicle-and-drivers/vehicles/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './components/vehicle-and-drivers/vehicles/vehicle-details/vehicle-details.component';
import { VehicleRequestFormComponent } from './components/vehicle-and-drivers/vehicle-requests/vehicle-request-form/vehicle-request-form.component';
import { VehicleRequestListComponent } from './components/vehicle-and-drivers/vehicle-requests/vehicle-request-list/vehicle-request-list.component';
import { VehicleAllocationComponent } from './components/vehicle-and-drivers/vehicle-requests/vehicle-allocation/vehicle-allocation.component';
import { VehicleAllocationListComponent } from './components/vehicle-and-drivers/vehicle-requests/vehicle-allocation-list/vehicle-allocation-list.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';

import { AuthGuard } from './services/auth/auth.guard';
import { MeetingMinutesListComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-list/meeting-minutes-list.component';
import { MeetingMinutesCreateComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-create/meeting-minutes-create.component';
import { MeetingMinutesDetailComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-detail/meeting-minutes-detail.component';
import { MemoListComponent } from './components/messaging-feature/memos/memo-list/memo-list.component';
import { MemoFormComponent } from './components/messaging-feature/memos/memo-form/memo-form.component';
import { MemoDetailComponent } from './components/messaging-feature/memos/memo-detail/memo-detail.component';
import { UserProfileComponent } from './components/authentication/user-profile/user-profile.component';
import { RetireFundComponent } from './components/fund-request/retire-fund/retire-fund.component';
import { RetireFundListComponent } from './components/fund-request/retire-fund-list/retire-fund-list.component';
import { RequestPrintViewComponent } from './components/fund-request/request-print-view/request-print-view.component';
import { MAndEReviewListComponent } from './components/fund-request/m-and-e-review-list/m-and-e-review-list.component';
import { FinanceReviewListComponent } from './components/fund-request/finance-review-list/finance-review-list.component';
import { FinanceLeaveListComponent } from './components/leaves/finance-leave-list/finance-leave-list.component';
import { HrLeaveListComponent } from './components/leaves/hr-leave-list/hr-leave-list.component';
import { ReportFormComponent } from './components/m-and-e/activity-reports/report-form/report-form.component';
import { ReportListComponent } from './components/m-and-e/activity-reports/report-list/report-list.component';
import { ReportDetailComponent } from './components/m-and-e/activity-reports/report-detail/report-detail.component';
import { DailyPermissionListComponent } from './components/daily-permission/daily-permission-list/daily-permission-list.component';
import { AddGoalComponent } from './components/m-and-e/add-goal/add-goal.component';
import { GoalsListComponent } from './components/m-and-e/goals-list/goals-list.component';
import { PerformanceAddComponent } from './components/m-and-e/performance-indicator/performance-add/performance-add.component';
import { PerformanceDetailComponent } from './components/m-and-e/performance-indicator/performance-detail/performance-detail.component';
import { PerformanceEditComponent } from './components/m-and-e/performance-indicator/performance-edit/performance-edit.component';
import { PerformanceListComponent } from './components/m-and-e/performance-indicator/performance-list/performance-list.component';
import { CreateReportFormComponent } from './components/m-and-e/monthly-reports/create-report-form/create-report-form.component';
import { ListReportComponent } from './components/m-and-e/monthly-reports/list-report/list-report.component';
import { MonthlyReportDetailComponent } from './components/m-and-e/monthly-reports/monthly-report-detail/monthly-report-detail.component';
import { VehicleRequestsFormComponent } from './components/vehicle-management/vehicle-request-form/vehicle-request-form.component';
import { AllocationListComponent } from './components/vehicle-management/allocation-list/allocation-list.component';
import { DriverStatusComponent } from './components/vehicle-management/driver-status/driver-status.component';
import { VehicleStatusComponent } from './components/vehicle-management/vehicle-status/vehicle-status.component';
import { ManagerLeaveListComponent } from './components/leaves/manager-leave-list/manager-leave-list.component';
import { BudgetCashflowComponent } from './components/budgets/budget-cashflow/budget-cashflow.component';
import { BudgetTransferComponent } from './components/budgets/budget-transfer/budget-transfer.component';
import { TransactionHistoryComponent } from './components/budgets/transaction-history/transaction-history.component';
import { ViewLeaveComponent } from './components/leaves/view-leave/view-leave.component';
import { PendingVehicleRequestsComponent } from './components/vehicle-and-drivers/vehicle-requests/pending-vehicle-requests/pending-vehicle-requests.component';
import { MyVehicleRequestsComponent } from './components/vehicle-and-drivers/vehicle-requests/my-vehicle-requests/my-vehicle-requests.component';
import { FundProcessListComponent } from './components/fund-request/finance-process/fund-process-list/fund-process-list.component';
import { FundProcessViewComponent } from './components/fund-request/finance-process/fund-process-view/fund-process-view.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // {  path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: 'employee-form/:id', component: EmployeeFormComponent },
  { path: 'employee-list', component: EmployeeListComponent },
  { path: 'employee-detail/:id', component: EmployeeDetailComponent },

  { path: 'leave-form', component: LeaveApplicationComponent },
  { path: 'leave-form/:id', component: LeaveApplicationComponent },
  { path: 'leave-list', component: LeaveListComponent },
  { path: 'leave-details/:id', component: LeaveDetailsComponent },
  { path: 'leave-view/:id', component: ViewLeaveComponent },
  { path: 'leave-edit/:id', component: LeaveEditComponent },
  { path: 'leave-approval', component: LeaveApprovalComponent },

{ path: 'manager-review', component: ManagerLeaveListComponent },
  { path: 'finance-leave-review', component: FinanceLeaveListComponent },
  { path: 'hr-leave-review', component: HrLeaveListComponent },

  { path: 'training-schedule', component: TrainingScheduleComponent },
  { path: 'training-add', component: TrainingAddComponent },
  { path: 'training-edit/:id', component: TrainingAddComponent },
  { path: 'employee-development', component: EmployeeDevelopmentComponent },

  { path: 'daily-permission-form', component: DailyPermissionFormComponent },
  { path: 'supervisor-approval', component: SupervisorApprovalComponent },
  { path: 'daily-permission-list', component: DailyPermissionListComponent },

  { path: 'payroll-add', component: PayrollAddComponent },
  { path: 'payroll-adjustment', component: PayrollAdjustmentComponent },
  { path: 'payroll-report', component: PayrollReportComponent },
  { path: 'payroll-list', component: PayrollListComponent },
  { path: 'payroll-edit/:id', component: PayrollEditComponent },
  { path: 'payroll-detail/:id', component: PayrollDetailComponent },

  { path: 'department-list', component: DepartmentListComponent },
  { path: 'department-add', component: DepartmentAddComponent },
  { path: 'department-edit/:id', component: DepartmentAddComponent },


  { path: 'projects', component: ProjectsListComponent },
  { path: 'project-form', component: ProjectsFormComponent },
  { path: 'project-detail/:id', component: ProjectsDetailsComponent },
  { path: 'project-form/:id', component: ProjectsFormComponent },

  // { path: 'tasks', component: TaskListComponent },
  // { path: 'task-form', component: TaskFormComponent },
  // { path: 'task-detail/:id', component: TaskDetailComponent },
  // { path: 'task-form/:id', component: TaskFormComponent },


  { path: 'budget-list', component: BudgetListComponent },
  { path: 'budget-form', component: BudgetFormComponent },
  { path: 'budget-form/:id', component: BudgetFormComponent },

  { path: 'budget-transfer', component: BudgetTransferComponent },
  { path: 'budget-cashflow', component: BudgetCashflowComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent },

  { path: 'request-form', component: RequestFormComponent },
  { path: 'request-list', component: RequestListComponent },
  { path: 'pending-requests', component: PendingRequestsComponent},
  { path: 'request-review/:id', component: RequestReviewComponent},
  { path: 'reviewed-requests', component: ReviewedRequestsComponent},
  { path: 'request-approval/:id', component: RequestApprovalComponent },
  { path: 'retire-fund', component: RetireFundComponent},
  { path: 'retire-fund-list', component: RetireFundListComponent},
  { path: 'print-request/:id', component: RequestPrintViewComponent },
  { path: 'm-and-e-review-list', component: MAndEReviewListComponent},
  { path: 'finance-list', component: FinanceReviewListComponent},

  { path: 'fund-process-list', component: FundProcessListComponent},
  { path: 'fund-process/:id', component: FundProcessViewComponent},


  { path: 'driver-form', component: DriverFormComponent },
  { path: 'driver-form/:id', component: DriverFormComponent },
  { path: 'driver-list', component: DriverListComponent },
  { path: 'driver-details/:id', component: DriverDetailComponent },

  { path: 'vehicle-form', component: VehicleFormComponent },
  { path: 'vehicle-form/:id', component: VehicleFormComponent },
  { path: 'vehicle-list', component: VehicleListComponent },
  { path: 'vehicle-details/:id', component: VehicleDetailsComponent },

  { path: 'vehicle-request-form', component: VehicleRequestFormComponent },
  { path: 'vehicle-request-form/:id', component: VehicleRequestFormComponent },
  // { path: 'vehicle-form/:id', component: VehicleFormComponent },
  { path: 'vehicle-request-list', component: VehicleRequestListComponent },
  { path: 'vehicle-allocation-form', component: VehicleAllocationComponent },
  { path: 'vehicle-allocation-list', component: VehicleAllocationListComponent },

  { path: 'meeting-minutes', component: MeetingMinutesListComponent },
  { path: 'meeting-minutes-create', component: MeetingMinutesCreateComponent },
  { path: 'meeting-minute-details/:id', component: MeetingMinutesDetailComponent },
  { path: 'meeting-minutes-edit/:id', component: MeetingMinutesCreateComponent },
  { path: 'pending-vehicle-requests', component: PendingVehicleRequestsComponent },
  { path: 'my-vehicle-requests', component:  MyVehicleRequestsComponent},

  { path: 'memos', component: MemoListComponent },
  { path: 'memo-form', component: MemoFormComponent },
  { path: 'memo-details/:id', component: MemoDetailComponent },
  { path: 'memo-form-edit/:id', component: MemoFormComponent },

  { path: 'profile', component: UserProfileComponent },

  { path: 'activity-report-form', component: ReportFormComponent },
  { path: 'activity-report-form/:id', component: ReportFormComponent },
  { path: 'view-reports', component: ReportListComponent },
  { path: 'report-detail/:id', component: ReportDetailComponent },

  { path: 'add-goal', component: AddGoalComponent },
  { path: 'goal-list', component: GoalsListComponent },

  { path: 'performance-list', component: PerformanceListComponent },
  { path: 'performance-add', component: PerformanceAddComponent },
  { path: 'performance-edit/:id', component: PerformanceAddComponent },

  // { path: 'performance-edit/:id', component: PerformanceEditComponent },
  { path: 'performance-detail/:id', component: PerformanceDetailComponent },

  // monthly reports
  { path: 'monthly-reports', component: ListReportComponent },
  { path: 'add-monthly-report', component: CreateReportFormComponent },
  { path: 'edit-monthly-report/:id', component: CreateReportFormComponent },
  { path: 'monthly-report-detail/:id', component: MonthlyReportDetailComponent },

  // vehicle management
  // { path: 'make-vehicle-request', component:  VehicleRequestsFormComponent},
  // { path: 'allocation-list', component: AllocationListComponent },
  // { path: 'driver-status', component: DriverStatusComponent },
  // { path: 'vehicle-status', component: VehicleStatusComponent  },

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' } // Default route
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: '', canActivate: [AuthGuard], children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
