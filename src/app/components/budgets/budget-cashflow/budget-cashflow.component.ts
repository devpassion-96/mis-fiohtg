import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-budget-cashflow',
  templateUrl: './budget-cashflow.component.html',
  styleUrls: ['./budget-cashflow.component.css'],
})
export class BudgetCashflowComponent implements OnInit {
  cashFlowForm: FormGroup;
  budgets = [];
   projects: Project[] = [];

  constructor(private fb: FormBuilder,private projectService: ProjectService, private toastr: ToastrService,private router: Router,private budgetService: BudgetService) {}

  ngOnInit(): void {
    // Initialize form
    this.cashFlowForm = this.fb.group({
      projectId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
    });

    // Load budgets
    this.budgetService.getAllBudgetRecords().subscribe((data) => {
      this.budgets = data;
    });

    this.loadProjects();
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
  submitCashFlow(): void {
    if (this.cashFlowForm.valid) {
      const { projectId, amount } = this.cashFlowForm.value;
      this.budgetService.addIncomingCashFlow(projectId, amount).subscribe(() => {
        if (window.confirm('Are you sure you want to add this cash flow?')) {
          this.toastr.success('Cash flow added successfully!');
          this.router.navigate(['/']);
        }
      });
    }
  }
}
