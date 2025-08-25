import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-budget-transfer',
  templateUrl: './budget-transfer.component.html',
  styleUrls: ['./budget-transfer.component.css'],
})
export class BudgetTransferComponent implements OnInit {
  transferForm: FormGroup;
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
    this.transferForm = this.fb.group(
      {
        sourceBudgetId: ['', Validators.required],
        targetBudgetId: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(1)]],
        description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      },
      { validators: this.budgetsMustDiffer('sourceBudgetId', 'targetBudgetId') }
    );

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

  budgetsMustDiffer(a: string, b: string) {
    return (group: FormGroup) => {
      const va = group.get(a)?.value;
      const vb = group.get(b)?.value;
      return va && vb && va === vb ? { sameBudget: true } : null;
    };
  }

  submitTransfer(): void {
    if (this.transferForm.invalid) return;

    const { sourceBudgetId, targetBudgetId, amount, description } = this.transferForm.value;

    if (!this.user?.staffId) {
      this.toastr.error('Unable to determine the logged-in staff.');
      return;
    }

    if (!window.confirm('Are you sure you want to transfer these funds?')) return;

    const payload = {
      sourceBudgetId,
      targetBudgetId,
      amount: Number(amount),
      description: String(description).trim(),
      createdByStaffId: this.user.staffId,
      createdByName: this.getDisplayName(),
    };

    this.isSubmitting = true;
    this.budgetService.transferFunds(payload).subscribe({
      next: () => {
        this.toastr.success('Funds transferred successfully!');
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Failed to transfer funds.');
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
