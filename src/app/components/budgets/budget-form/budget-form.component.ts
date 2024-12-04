import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { Budget } from 'src/app/models/project-management/budget.model';
import { Project } from 'src/app/models/project-management/project.model';
import { Department } from 'src/app/models/department.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  projects: Project[] = [];
  departments: Department[] = [];
  allBudgets: Budget[] = [];
  isEditMode = false;
  currentBudgetId: string | null = null;

  user: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private departmentService: DepartmentService,
    private budgetService: BudgetService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadProjects();
    this.loadDepartments();
    this.loadAllBudgets(); // Load all budgets


    this.route.paramMap.subscribe(params => {
      const budgetId = params.get('id');
      if (budgetId) {
        this.isEditMode = true;
        this.currentBudgetId = budgetId;
        this.loadBudgetData(this.currentBudgetId);
      }
    });

    this.populateUserData();
  }

  populateUserData() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.budgetForm.patchValue({ createdBy: userData.staffId });
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  initializeForm() {
    this.budgetForm = this.fb.group({
      projectId: ['', Validators.required],
      departmentId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      balance: [''],
      createdBy: ['', Validators.required]
    });
  }

  loadAllBudgets() {
    this.budgetService.getAllBudgetRecords().subscribe({
      next: (budgets) => {
        this.allBudgets = budgets;
        this.loadProjects(); // Call loadProjects after budgets are loaded
      },
      error: () => {
        this.toastr.error('Error fetching budgets');
      }
    });
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe(data => {
      // Filter projects that are not associated with a budget
      this.projects = data.filter(project =>
        !this.allBudgets.some(budget => budget.projectId === project._id)
      );
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(data => this.departments = data);
  }

  loadBudgetData(budgetId: string) {
    this.budgetService.getBudgetById(budgetId.toString()).subscribe({
      next: (budget) => {
        this.budgetForm.patchValue({
          projectId: budget.projectId,
          departmentId: budget.departmentId,
          amount: budget.amount
        });
      },
      error: () => this.toastr.error('Error loading budget data')
    });
  }

  submitBudget() {
    this.submitted = true;
    if (this.budgetForm.valid) {
      const formValues = this.budgetForm.value;
      const budgetData: Budget = {
        ...formValues,
        projectId: formValues.projectId,  // Convert to number
        departmentId: formValues.departmentId,  // Convert to number
        balance: formValues.amount
      };

      // const budgetDataUpdate: Budget = {
      //   ...formValues,
      //   projectId: +formValues.projectId,  // Convert to number
      //   departmentId: +formValues.departmentId,
      // };

      if (this.isEditMode && this.currentBudgetId) {
        this.budgetService.updateBudgetRecord(this.currentBudgetId, budgetData).subscribe({
          next: () => this.handleSuccess('Budget updated successfully!'),
          error: () => this.handleError('Failed to update budget')
        });
      } else {
        this.budgetService.addBudgetRecord(budgetData).subscribe({
          next: () => this.handleSuccess('Budget added successfully!'),
          error: (err) => this.handleError(err)
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }

  private handleSuccess(message: string) {
    this.toastr.success(message);
    this.router.navigate(['/budget-list']);
  }

  private handleError(message: string) {
    this.toastr.error(message);
    console.error(message);
  }
}
