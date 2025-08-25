import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { Budget } from 'src/app/models/project-management/budget.model';
import { Project } from 'src/app/models/project-management/project.model';
import { Transaction, TransactionView } from 'src/app/models/transactions.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service'; // NEW

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  loading = false;
  error: string | null = null;

  rows: TransactionView[] = [];
  filteredRows: TransactionView[] = [];

  typeFilter: 'all' | 'transfer' | 'cashflow' = 'all';
  searchText = '';

  p = 1;
  itemsPerPage = 10;

  constructor(
    private budgetService: BudgetService,
    private projectService: ProjectService,
    private employeeService: EmployeeService // NEW
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      txs: this.budgetService.getTransactionHistory(),
      budgets: this.budgetService.getAllBudgetRecords(),
      projects: this.projectService.getAllProjectRecords(),
      employees: this.employeeService.getAllEmployees() // NEW
    }).subscribe({
      next: ({ txs, budgets, projects, employees }) => {
        // Project name maps
        const projectNameById = new Map<string, string>(
          (projects as Project[]).map(p => [p._id, p.name])
        );
        const projectNameByBudgetId = new Map<string, string>();
        (budgets as Budget[]).forEach(b => {
          const pname = b.projectId ? projectNameById.get(b.projectId) : undefined;
          if (b._id) projectNameByBudgetId.set(b._id, pname ?? '(unknown project)');
        });

        // StaffId -> Display Name map (first + last fallback chain)  // NEW
        const staffNameById = new Map<string, string>();
        (employees || []).forEach((e: any) => {
          const display =
            [e?.firstName, e?.lastName].filter(Boolean).join(' ') ||
            e?.fullName ||
            e?.employeeName ||
            e?.name ||
            '';
          if (e?.staffId && display) staffNameById.set(e.staffId, display);
        });

        // Map transactions to view rows, injecting createdByName when missing  // UPDATED
        this.rows = (txs as Transaction[]).map(t => {
          const created = t.createdAt || t.date || '';
          const resolvedName =
            t.createdByName ||
            (t.createdByStaffId ? staffNameById.get(t.createdByStaffId) : undefined);

          const view: TransactionView = {
            ...t,
            createdAtResolved: created ? new Date(created).toISOString() : undefined,
            createdByName: resolvedName // <- critical line
          };

          if (t.type === 'transfer') {
            view.sourceProjectName = t.sourceBudgetId
              ? (projectNameByBudgetId.get(t.sourceBudgetId) ?? '(unknown)')
              : '';
            view.targetProjectName = t.targetBudgetId
              ? (projectNameByBudgetId.get(t.targetBudgetId) ?? '(unknown)')
              : '';
          } else if (t.type === 'cashflow') {
            view.projectName = t.projectId
              ? (projectNameById.get(t.projectId) ?? '(unknown)')
              : '';
          }

          return view;
        })
        // newest first
        .sort((a, b) => {
          const da = a.createdAtResolved ? new Date(a.createdAtResolved).getTime() : 0;
          const db = b.createdAtResolved ? new Date(b.createdAtResolved).getTime() : 0;
          return db - da;
        });

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load transaction history.';
        this.loading = false;
      }
    });
  }

  // modal view
  modalOpen = false;
  selected: TransactionView | null = null;

  openModal(tx: TransactionView): void {
    this.selected = tx;
    this.modalOpen = true;
  }
  closeModal(): void {
    this.modalOpen = false;
    this.selected = null;
  }

  applyFilters(): void {
    const type = this.typeFilter;
    const term = this.searchText?.trim().toLowerCase();

    this.filteredRows = this.rows.filter(r => {
      const typeOk = type === 'all' ? true : r.type === type;
      const termOk = !term ? true :
        (r.description?.toLowerCase().includes(term) ||
         r.sourceProjectName?.toLowerCase().includes(term) ||
         r.targetProjectName?.toLowerCase().includes(term) ||
         r.projectName?.toLowerCase().includes(term) ||
         r.createdByName?.toLowerCase().includes(term) ||          // NEW: search by staff name
         r.createdByStaffId?.toLowerCase().includes(term));        // NEW: search by staff id
      return typeOk && termOk;
    });
  }

  formatDate(v?: string): string {
    if (!v) return '';
    const d = new Date(v);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10); // YYYY-MM-DD
  }
}
