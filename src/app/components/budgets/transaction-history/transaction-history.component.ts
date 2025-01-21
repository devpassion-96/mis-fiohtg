import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project-management/project.model';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
})
export class TransactionHistoryComponent implements OnInit {
  transactions = [];
projects: Project[] = [];


  constructor(private budgetService: BudgetService,private projectService: ProjectService) {}

  ngOnInit(): void {
    // Fetch transaction history
    this.budgetService.getTransactionHistory().subscribe((data) => {
      this.transactions = data;
      console.log("transaction data: ", data);
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
}
