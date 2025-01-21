import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-budget-transfer',
  templateUrl: './budget-transfer.component.html',
  styleUrls: ['./budget-transfer.component.css'],
})
export class BudgetTransferComponent implements OnInit {
  transferForm: FormGroup;
  budgets = [];

   projects: Project[] = [];

  constructor(private fb: FormBuilder, private projectService: ProjectService, private toastr: ToastrService,private router: Router, private budgetService: BudgetService) {}

  ngOnInit(): void {
    // Initialize form
    this.transferForm = this.fb.group({
      sourceBudgetId: ['', Validators.required],
      targetBudgetId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
    });

    // Load budgets
    this.budgetService.getAllBudgetRecords().subscribe((data) => {
      this.budgets = data;
    });

    this.loadProjects();
  }

  submitTransfer(): void {
    if (this.transferForm.valid) {
      const { sourceBudgetId, targetBudgetId, amount } = this.transferForm.value;
      if (window.confirm('Are you sure you want to transfer these funds?')) {
        this.budgetService.transferFunds(sourceBudgetId, targetBudgetId, amount).subscribe(() => {
          this.toastr.success('Funds transferred successfully!');
          this.router.navigate(['/']);
        });
    }}
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe(data => {
      this.projects = data;
    });
  }

  getProjectNameById(projectId: string) {
    const project = this.projects.find(prj => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }
}
