import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { Leave } from 'src/app/models/leave.model';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { Budget } from 'src/app/models/project-management/budget.model';
import { DecimalPipe } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Chart, registerables } from 'chart.js';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { Department } from 'src/app/models/department.model';
import { AuthService } from 'src/app/services/auth/auth.service';
Chart.register(...registerables);


interface LeaveBalance {
  taken: number;
  remaining: number;
}

interface EmployeeLeaveBalances {
  [staffId: string]: LeaveBalance;
}

interface ReportData {
  mostCommonLeaveTypes: { [key: string]: number };
  highVolumePeriods: { [key: string]: number };
  employeeLeaveBalances: { [key: string]: LeaveBalance };
}

interface ProjectInsight {
  project: Project;
  budget: Budget;
  budgetUsed: number; // This could be a calculated field representing the budget used
  budgetRemaining: number; // Remaining budget
}

interface ExtendedProject extends Project {
  progress: number;
  statusClass: string;
}


interface ExtendedLeave extends Leave {
  employeeName?: string;
}

interface ExtendedBudget extends Budget {
  projectName?: string;
  departmentName?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  leaves: Leave[] = [];

  reportData: ReportData;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  // employee data
  totalEmployees = 0;
  recentHires = 0;
  departmentDistribution = {};


  // for projects and budgets:
  projects: Project[] = [];
  projectBar: ExtendedProject[] = []; // This will hold projects with progress and status

  upcomingDeadlines: Project[] = [];
  budgetSummaries: { project: Project; budgetUtilization: number }[] = [];
  totalBudget: number = 0;
  totalBudgetUsed: number = 0;
  totalBalance: number = 0;

  projectInsights: ProjectInsight[] = [];

// pending leaves data
  pendingLeaves: ExtendedLeave[]=[];
  selectedLeave: ExtendedLeave | null = null;
  @ViewChild('leaveDetailsModal') leaveDetailsModal: ElementRef;



  userRole: string; // To store the role of the logged-in user
  
  userDepartment: string;
  userStaffId: string;

  constructor(
    private employeeService: EmployeeService, private toastr: ToastrService,
    private leavesService: LeavesService,private projectService: ProjectService,
    private budgetService: BudgetService, private decimalPipe: DecimalPipe,
    private departmentService: DepartmentService,private authService: AuthService
  ) {}

  ngOnInit() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
      this.leavesService.getAllLeaves().subscribe(data => {
        this.leaves = data;
        this.processData();
      });
    });

    //process employee data to get the length, and also recently hired employees..........................
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.processEmployeeData(employees);
    });

    // for project and budgets
    this.forProjectAndBudgetData();

    // for project insights
    this.fetchData();

    // for project bar

    this.loadProjects();

    // fetch pending leaves

    this.fetchPendingLeaves();

    // fetching budget details:

    this.loadBudgets();

    this.getAllLeavesCount();

    this.employeeDepartmentDataForCharts();
    
    this.loadUserRole();



  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role; // Role of the user
      this.userDepartment = userData.department; // Department for managers
      this.userStaffId = userData.staffId; // Staff ID for employees
    } else {
      this.userRole = 'Employee';
    }
  }

  processEmployeeData(employees: Employee[]): void {
    const recentHireCutoff = new Date();
    recentHireCutoff.setDate(recentHireCutoff.getDate() - 30); // Last 30 days

    this.totalEmployees = employees.length;
    this.recentHires = employees.filter(e => new Date(e.appointmentDate) > recentHireCutoff).length;

    this.departmentDistribution = employees.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {});
  }

  // for leave data.............................................................
  processData() {
    // Process the data for reports
    this.generateReports();
  }

  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  generateReports() {
    this.reportData = {
      mostCommonLeaveTypes: this.calculateMostCommonLeaveTypes(this.leaves),
      highVolumePeriods: this.calculateHighVolumePeriods(),
      employeeLeaveBalances: this.calculateLeaveBalances()
    };
  }

  calculateHighVolumePeriods() {
    const monthCounts = {};
    this.leaves.forEach(leave => {
      const month = new Date(leave.startDate).getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return monthCounts;
  }

  calculateMostCommonLeaveTypes(leaves: Leave[]): any {
    const leaveTypeCounts = {};
    leaves.forEach((leave) => {
      if (leaveTypeCounts[leave.type]) {
        leaveTypeCounts[leave.type]++;
      } else {
        leaveTypeCounts[leave.type] = 1;
      }
    });
    return leaveTypeCounts;
  }


calculateLeaveBalances(): EmployeeLeaveBalances {
  const balances: EmployeeLeaveBalances = {};
  const maxLeaveEntitlement = 21; // Maximum leave days allowed per year

  this.employees.forEach(employee => {
    const employeeLeaves = this.leaves.filter(leave => leave.staffId === employee.staffId);
    let totalDaysTaken = 0;

    employeeLeaves.forEach(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1; // +1 to include the start day
      totalDaysTaken += duration;
    });

    balances[employee.staffId] = {
      taken: totalDaysTaken,
      remaining: Math.max(0, maxLeaveEntitlement - totalDaysTaken) // Ensure it doesn't go below 0
    };
  });

  return balances;
} // end of leave data.................................................


// for projects and budget dashboard.............................................

// forProjectAndBudgetData(){
//      // Fetch all projects
//      this.projectService.getAllProjectRecords().subscribe((projects) => {
//       this.projects = projects;

//       // Filter ongoing projects (In Progress)
//       this.projects = this.projects.filter(
//         (project) => project.status === 'In Progress'
//       );

//       // Sort projects by upcoming deadlines
//       this.projects.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());

//       // Fetch budget summaries
//       this.budgetService.getAllBudgetRecords().subscribe((budgets) => {
//         this.calculateBudgetUtilization(budgets);
//       });
//     });
// }

forProjectAndBudgetData() {
  this.projectService.getAllProjectRecords().subscribe((projects) => {
    this.projects = projects;

    // Fetch budget summaries
    this.budgetService.getAllBudgetRecords().subscribe((budgets) => {
      this.totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);

      // Recalculate totalBudgetUsed based on budget amount and balance
      this.totalBudgetUsed = budgets.reduce((acc, budget) => {
        // The used amount is the original amount minus the balance
        const usedAmount = budget.amount - budget.balance;
        return acc + usedAmount;
      }, 0);

      // Round totalBudgetUsed to ensure it's a whole number
      this.totalBudgetUsed = Math.round(this.totalBudgetUsed);
    });
  });
}





// private calculateBudgetUtilization(budgets: Budget[]): void {
//   this.totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);

//   // Calculate budget utilization for each project
//   this.projects.forEach((project) => {
//     const projectBudget = budgets.find((budget) => budget.projectId === project.id);

//     console.log("projectBudget : "+ projectBudget)
//     if (projectBudget) {
//       const budgetUtilization = (projectBudget.amount / projectBudget.amount) * 100;
//       this.budgetSummaries.push({ project, budgetUtilization });
//       this.totalBudgetUsed += projectBudget.amount;

//     }
//   });
// }

// end of project dashboard...............................................................


// .......................................................................... check again for project insights
fetchData() {
  forkJoin({
    projects: this.projectService.getAllProjectRecords(),
    budgets: this.budgetService.getAllBudgetRecords()
  }).subscribe(({ projects, budgets }) => {
    this.processDataBudgetProject(projects, budgets);
  });
}

// processDataBudgetProject(projects: Project[], budgets: Budget[]) {
//   projects.forEach(project => {
//     const budget = budgets.find(b => b.projectId === project.id);

//     if (budget) {
//       const budgetUsed = this.calculateBudgetUsed(project, budget);
//       const budgetRemaining = budget.amount - budgetUsed;

//       this.projectInsights.push({
//         project,
//         budget,
//         budgetUsed,
//         budgetRemaining
//       });
//     }
//   });
// }

processDataBudgetProject(projects: Project[], budgets: Budget[]) {
  projects.forEach(project => {
    const budget = budgets.find(b => b.projectId === project._id);
    if (budget) {
      // Calculate the budget used and remaining for each project
      const now = new Date();
      let budgetUsed;
      if (new Date(project.startDate) > now) {
        budgetUsed = 0; // Project not started
      } else if (new Date(project.endDate) < now) {
        budgetUsed = budget.amount; // Project completed
      } else {
        // Project in progress
        const totalDuration = new Date(project.endDate).getTime() - new Date(project.startDate).getTime();
        const elapsed = now.getTime() - new Date(project.startDate).getTime();
        const progress = elapsed / totalDuration;
        budgetUsed = budget.amount * progress;
      }

      const budgetRemaining = budget.amount - budgetUsed;
      this.projectInsights.push({
        project,
        budget,
        budgetUsed,
        budgetRemaining
      });
    }
  });
}


calculateBudgetUsed(project: Project, budget: Budget): number {
  const now = new Date();
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  if (now < startDate) {
    // Project hasn't started yet
    return 0;
  } else if (now > endDate) {
    // Project is completed
    return budget.amount;
  } else {
    // Project is in progress
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = elapsed / totalDuration;
    return budget.amount * progress; // Proportional budget usage based on time elapsed
  }
}

// end of project insights.........................

loadProjects() {
  this.projectService.getAllProjectRecords().subscribe(projects => {
    this.projectBar = projects.map(project => ({
      ...project,
      progress: this.calculateProgress(project.startDate, project.endDate),
      statusClass: `status-${project.status.replace(' ', '-').toLowerCase()}`
    }) as ExtendedProject);
  });
}

calculateProgress(startDate: Date, endDate: Date): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  if (now < start) {
    return 0;
  }
  if (now > end) {
    return 100;
  }

  return ((now - start) / (end - start)) * 100;
}

// pending leaves..................

fetchPendingLeaves() {
  forkJoin({
    leaves: this.leavesService.getAllLeaves(),
    employees: this.employeeService.getAllEmployees()
  }).pipe(
    map(({ leaves, employees }) => {
      return leaves.filter(leave => leave.status === 'Pending').map(leave => ({
        ...leave,
        employeeName: employees.find(emp => emp.staffId === leave.staffId)?.firstName + ' ' +
                      employees.find(emp => emp.staffId === leave.staffId)?.lastName
      }));
    })
  ).subscribe({
    next: (mappedLeaves) => {
      this.pendingLeaves = mappedLeaves;
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
  }
}


approveLeave(leave: Leave) {
  if (confirm('Are you sure you want to approve this leave request?')) {
    const updatedLeave = {
      ...leave,
      status: 'Approved',
      approverComments: this.selectedLeave.approverComments,
      approvedBy: 'Manager', // Replace with actual approver's user ID
      approvedOn: new Date()
    };
    this.leavesService.updateLeave(leave._id, updatedLeave).subscribe(
      () => {
        this.toastr.success('Leave Approved', 'Success');
        this.fetchPendingLeaves();
        this.closeModal();
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
      approvedBy: 'Manager', // Replace with actual approver's user ID
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

// end of emoloyee Leaves....................................................

// charts for departments.....................................

departments: Department[] = []; // Add this line to store department data

departmentData: any = {};

employeeDepartmentDataForCharts() {
  forkJoin({
    employees: this.employeeService.getAllEmployees(),
    departments: this.departmentService.getDepartments()
  }).subscribe(({ employees, departments }) => {
    this.departments = departments;
    this.processDepartmentData(employees);
    this.createDepartmentChart();
  });
}




  processDepartmentData(employees: Employee[]): void {
    employees.forEach(employee => {
      const departmentName = this.departments.find(d => d._id === employee.department)?.name;
      if (departmentName) {
        if (!this.departmentData[departmentName]) {
          this.departmentData[departmentName] = 0;
        }
        this.departmentData[departmentName]++;
      }
    });
  }

  createDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    const departmentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.departmentData),
        datasets: [{
          label: 'Number of Employees',
          data: Object.values(this.departmentData),
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

// end of charts........................


// recent project budgets

budgets: ExtendedBudget[] = [];


loadBudgets() {
  forkJoin({
    budgets: this.budgetService.getAllBudgetRecords(),
    projects: this.projectService.getAllProjectRecords(),
    departments: this.departmentService.getDepartments()
  }).pipe(
    map(({ budgets, projects, departments }) => {
      return budgets.map(budget => ({
        ...budget,
        projectName: projects.find(p => p._id === budget.projectId)?.name,
        departmentName: departments.find(d => d._id === budget.departmentId)?.name
      }));
    })
  ).subscribe({
    next: (mappedBudgets) => {
      console.log('Mapped Budgets:', mappedBudgets);
      this.budgets = mappedBudgets;
    },
    error: (error) => {
      console.error('Error loading data', error);
    }
  });
}


// get leaves counts
allLeavesCount;
pendingLeaveCount;
approvedLeaveCount;
rejectedLeaveCount;

getAllLeavesCount(){

  this.leavesService.getAllLeaves().subscribe({
    next: (data) => {
      this.allLeavesCount = data.length;

    },
    error: (err) => {

    }
  });

  this.leavesService.getAllLeaves().subscribe({
    next: (data) => {
      this.pendingLeaveCount = data.filter(leave => leave.status !== 'Approved' && leave.status !== 'Rejected').length;



    },
    error: (err) => {
      // this.toastr.error('Error loading leaves');
    }
  });

  this.leavesService.getAllLeaves().subscribe({
    next: (data) => {
      this.approvedLeaveCount = data.filter(leave => leave.status === 'Approved').length;

    },
    error: (err) => {
      // this.toastr.error('Error loading leaves');
    }
  });

  this.leavesService.getAllLeaves().subscribe({
    next: (data) => {
      this.rejectedLeaveCount = data.filter(leave => leave.status === 'Rejected').length;

    },
    error: (err) => {
      // this.toastr.error('Error loading leaves');
    }
  });
}


}

