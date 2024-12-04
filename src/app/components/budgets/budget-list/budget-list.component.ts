import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from 'src/app/models/project-management/budget.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { Department } from 'src/app/models/department.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { ProjectService } from 'src/app/services/project-management/project.service';

interface ExtendedBudget extends Budget {
  projectName?: string;
  departmentName?: string;
}

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  // budgets: Budget[] = [];
  budgets: ExtendedBudget[] = []; // Use the extended interface

  constructor(
    private budgetService: BudgetService,
    private toastr: ToastrService, private router: Router,
    private projectService: ProjectService,
    private departmentService: DepartmentService,
  ) {}

  ngOnInit() {
    this.loadBudgets();
  }


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
        this.toastr.error('Error loading data');
      }
    });
  }

  editBudget(id: number) {
    // Logic to navigate to the edit budget form with the budgetId
    this.router.navigate(['/budget-form', id]);
  }

  deleteBudget(budgetId: number) {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudgetRecord(budgetId.toString()).subscribe({
        next: () => {
          this.toastr.success('Budget deleted successfully');
          this.loadBudgets(); // Reload the list after deletion
        },
        error: () => this.toastr.error('Error while deleting budget')
      });
    }
  }
}
