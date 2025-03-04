import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgChartjsModule } from 'ng-chartjs';
import { DecimalPipe } from '@angular/common';


import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
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
import { PayrollListComponent } from './components/payroll/payroll-list/payroll-list.component';
import { PayrollAddComponent } from './components/payroll/payroll-add/payroll-add.component';
import { PayrollEditComponent } from './components/payroll/payroll-edit/payroll-edit.component';
import { PayrollDetailComponent } from './components/payroll/payroll-detail/payroll-detail.component';
import { PayrollReportComponent } from './components/payroll/payroll-report/payroll-report.component';
import { PayrollAdjustmentComponent } from './components/payroll/payroll-adjustment/payroll-adjustment.component';
import { DepartmentAddComponent } from './components/department/department-add/department-add.component';
import { DepartmentEditComponent } from './components/department/department-edit/department-edit.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { ProjectsListComponent } from './components/projects/projects-list/projects-list.component';
import { ProjectsDetailsComponent } from './components/projects/projects-details/projects-details.component';
import { ProjectsFormComponent } from './components/projects/projects-form/projects-form.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { BudgetFormComponent } from './components/budgets/budget-form/budget-form.component';
import { BudgetListComponent } from './components/budgets/budget-list/budget-list.component';
import { RequestFormComponent } from './components/fund-request/request-form/request-form.component';
import { RequestListComponent } from './components/fund-request/request-list/request-list.component';
import { RequestReviewComponent } from './components/fund-request/request-review/request-review.component';
import { RequestApprovalComponent } from './components/fund-request/request-approval/request-approval.component';
import { PendingRequestsComponent } from './components/fund-request/pending-requests/pending-requests.component';
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
import { VehicleAllocationHistoryComponent } from './components/vehicle-and-drivers/vehicle-requests/vehicle-allocation-history/vehicle-allocation-history.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { MeetingMinutesListComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-list/meeting-minutes-list.component';
import { MeetingMinutesDetailComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-detail/meeting-minutes-detail.component';
import { MeetingMinutesCreateComponent } from './components/messaging-feature/meeting-minutes/meeting-minutes-create/meeting-minutes-create.component';
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
import { BoardLeaveListComponent } from './components/leaves/board-leave-list/board-leave-list.component';
import { ReportFormComponent } from './components/m-and-e/activity-reports/report-form/report-form.component';
import { ReportListComponent } from './components/m-and-e/activity-reports/report-list/report-list.component';
import { ReportDetailComponent } from './components/m-and-e/activity-reports/report-detail/report-detail.component';
import { DailyPermissionListComponent } from './components/daily-permission/daily-permission-list/daily-permission-list.component';
import { GoalsListComponent } from './components/m-and-e/goals-list/goals-list.component';
import { AddGoalComponent } from './components/m-and-e/add-goal/add-goal.component';
import { TrackActivityListComponent } from './components/m-and-e/track-activities/track-activity-list/track-activity-list.component';
import { TrackActivityFormComponent } from './components/m-and-e/track-activities/track-activity-form/track-activity-form.component';
import { PerformanceListComponent } from './components/m-and-e/performance-indicator/performance-list/performance-list.component';
import { PerformanceAddComponent } from './components/m-and-e/performance-indicator/performance-add/performance-add.component';
import { PerformanceEditComponent } from './components/m-and-e/performance-indicator/performance-edit/performance-edit.component';
import { PerformanceDetailComponent } from './components/m-and-e/performance-indicator/performance-detail/performance-detail.component';

import {NgxPrintModule} from 'ngx-print';
import { CreateReportFormComponent } from './components/m-and-e/monthly-reports/create-report-form/create-report-form.component';
import { ListReportComponent } from './components/m-and-e/monthly-reports/list-report/list-report.component';
import { MonthlyReportDetailComponent } from './components/m-and-e/monthly-reports/monthly-report-detail/monthly-report-detail.component';
import { DriverStatusComponent } from './components/vehicle-management/driver-status/driver-status.component';
import { VehicleStatusComponent } from './components/vehicle-management/vehicle-status/vehicle-status.component';
import { AllocationListComponent } from './components/vehicle-management/allocation-list/allocation-list.component';
import { VehicleRequestsFormComponent } from './components/vehicle-management/vehicle-request-form/vehicle-request-form.component';
import { ManagerLeaveListComponent } from './components/leaves/manager-leave-list/manager-leave-list.component';
import { BudgetTransferComponent } from './components/budgets/budget-transfer/budget-transfer.component';
import { BudgetCashflowComponent } from './components/budgets/budget-cashflow/budget-cashflow.component';
import { TransactionHistoryComponent } from './components/budgets/transaction-history/transaction-history.component';
import { ViewLeaveComponent } from './components/leaves/view-leave/view-leave.component';
import { PendingVehicleRequestsComponent } from './components/vehicle-and-drivers/vehicle-requests/pending-vehicle-requests/pending-vehicle-requests.component';
import { MyVehicleRequestsComponent } from './components/vehicle-and-drivers/vehicle-requests/my-vehicle-requests/my-vehicle-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    LeaveApplicationComponent,
    LeaveListComponent,
    LeaveDetailsComponent,
    LeaveEditComponent,
    LeaveApprovalComponent,
    TrainingScheduleComponent,
    TrainingAddComponent,
    EmployeeDevelopmentComponent,
    DailyPermissionFormComponent,
    SupervisorApprovalComponent,
    PayrollListComponent,
    PayrollAddComponent,
    PayrollEditComponent,
    PayrollDetailComponent,
    PayrollReportComponent,
    PayrollAdjustmentComponent,
    DepartmentAddComponent,
    DepartmentEditComponent,
    DepartmentListComponent,
    ProjectsListComponent,
    ProjectsDetailsComponent,
    ProjectsFormComponent,
    TaskListComponent,
    TaskDetailComponent,
    TaskFormComponent,
    BudgetFormComponent,
    BudgetListComponent,
    RequestFormComponent,
    RequestListComponent,
    RequestReviewComponent,
    RequestApprovalComponent,
    PendingRequestsComponent,
    ReviewedRequestsComponent,
    DriverFormComponent,
    DriverListComponent,
    DriverDetailComponent,
    VehicleFormComponent,
    VehicleListComponent,
    VehicleDetailsComponent,
    VehicleRequestFormComponent,
    VehicleRequestListComponent,
    VehicleAllocationComponent,
    VehicleAllocationListComponent,
    VehicleAllocationHistoryComponent,
    RegisterComponent,
    LoginComponent,
    MeetingMinutesListComponent,
    MeetingMinutesDetailComponent,
    MeetingMinutesCreateComponent,
    MemoListComponent,
    MemoFormComponent,
    MemoDetailComponent,
    UserProfileComponent,
    RetireFundComponent,
    RetireFundListComponent,
    RequestPrintViewComponent,
    MAndEReviewListComponent,
    FinanceReviewListComponent,
    FinanceLeaveListComponent,
    HrLeaveListComponent,
    BoardLeaveListComponent,
    ReportFormComponent,
    ReportListComponent,
    ReportDetailComponent,
    DailyPermissionListComponent,
    GoalsListComponent,
    AddGoalComponent,
    TrackActivityListComponent,
    TrackActivityFormComponent,
    PerformanceListComponent,
    PerformanceAddComponent,
    PerformanceEditComponent,
    PerformanceDetailComponent,
    CreateReportFormComponent,
    ListReportComponent,
    MonthlyReportDetailComponent,
    DriverStatusComponent,
    VehicleStatusComponent,
    AllocationListComponent,
    VehicleRequestsFormComponent,
    ManagerLeaveListComponent,
    BudgetTransferComponent,
    BudgetCashflowComponent,
    TransactionHistoryComponent,
    ViewLeaveComponent,
    PendingVehicleRequestsComponent,
    MyVehicleRequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule, // required for toastr animations
    ToastrModule.forRoot(),
    NgChartjsModule,
    NgxPrintModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
