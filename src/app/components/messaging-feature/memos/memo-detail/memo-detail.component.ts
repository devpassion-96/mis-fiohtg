import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { Memo } from 'src/app/models/messaging-feature/memos.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { MemoService } from 'src/app/services/messaging-feature/memos.service';

@Component({
  selector: 'app-memo-detail',
  templateUrl: './memo-detail.component.html',
  styleUrls: ['./memo-detail.component.css'],
})
export class MemoDetailComponent implements OnInit {
  memo: Memo;
  employees: Employee[] = [];

  constructor(private memoService: MemoService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
     private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.loadMemoDetail();
    this.loadAllEmployees();
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


  loadMemoDetail() {
    // Extract memo ID from route parameter
    const memoId = this.route.snapshot.paramMap.get('id');

    // Fetch the memo data
    this.memoService.getMemoById(memoId).subscribe(
      (memo) => {
        this.memo = memo;
      },
      (error) => {
        console.error('Error loading memo detail:', error);
        // Handle errors if needed
      }
    );
  }
  print() {
    setTimeout(() => window.print(), 1000); // Trigger print after data is loaded
  }
}
