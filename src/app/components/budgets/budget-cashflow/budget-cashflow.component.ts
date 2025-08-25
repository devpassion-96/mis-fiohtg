import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-budget-cashflow',
  templateUrl: './budget-cashflow.component.html',
  styleUrls: ['./budget-cashflow.component.css'],
})
export class BudgetCashflowComponent implements OnInit {
  cashFlowForm: FormGroup;
  budgets: any[] = [];
  projects: Project[] = [];
  user: any;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userProfileService: UserProfileService,
    private toastr: ToastrService,
    private router: Router,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.cashFlowForm = this.fb.group({
      projectId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.budgetService.getAllBudgetRecords().subscribe((data) => (this.budgets = data));
    this.loadProjects();
    this.loadUser();
  }

  private loadUser() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData) this.user = userData;
      },
      (err) => console.error('Error fetching user profile:', err)
    );
    if (!this.user) this.userProfileService.getUserProfile();
  }

  private getDisplayName(): string | undefined {
    return this.user?.fullName || this.user?.name || this.user?.employeeName || undefined;
  }

  submitCashFlow(): void {
    if (this.cashFlowForm.invalid) return;

    const { projectId, amount, description } = this.cashFlowForm.value;

    if (!this.user?.staffId) {
      this.toastr.error('Unable to determine the logged-in staff.');
      return;
    }

    if (!window.confirm('Are you sure you want to add this cash flow?')) return;

    const payload = {
      projectId,
      amount: Number(amount),
      description: String(description).trim(),
      createdByStaffId: this.user.staffId,
      createdByName: this.getDisplayName(),
    };

    this.isSubmitting = true;
    this.budgetService.addIncomingCashFlow(payload).subscribe({
      next: () => {
        this.toastr.success('Cash flow added successfully!');
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Failed to add cash flow.');
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe((data) => {
      this.projects = data;
    });
  }

  getProjectNameById(projectId: string) {
    const project = this.projects.find((prj) => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }
}
  