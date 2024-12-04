import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { Memo } from 'src/app/models/messaging-feature/memos.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { MemoService } from 'src/app/services/messaging-feature/memos.service';

@Component({
  selector: 'app-memo-list',
  templateUrl: './memo-list.component.html',
  styleUrls: ['./memo-list.component.css'],
})
export class MemoListComponent implements OnInit {
  memosList: Memo[] = [];
  employees: Employee[] = [];

  constructor(private memoService: MemoService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadMemoList();
    this.loadAllEmployees()
  }

  loadMemoList() {
    this.memoService.getAllMemoRecords().subscribe(
      (memos) => {
        this.memosList = memos;
      },
      (error) => {
        console.error('Error loading memo list:', error);
        // Handle errors if needed
      }
    );
  }

  loadAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: () => {
        this.toastr.error('Error fetching employees');
      }
    });
  }

  getEmployeeNameByStaffId(staffId: string): string {
    const employee = this.employees.find(emp => emp.staffId === staffId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  viewMemo(id: string) {
    // Navigate to the view page with the memo's ID as a parameter
    this.router.navigate(['memo-details', id]);
  }

  editMemo(id: string) {
    // Navigate to the edit page with the memo's ID as a parameter
    this.router.navigate(['memo-form-edit', id]);
  }
}