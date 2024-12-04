import { Component, OnInit } from '@angular/core';
import { Payroll } from 'src/app/models/payroll.model';
import { PayrollService } from 'src/app/services/hrm/payroll.service';

@Component({
  selector: 'app-payroll-list',
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.css']
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = [];

  constructor(private payrollService: PayrollService) { }

  ngOnInit(): void {
    this.fetchPayrolls();
  }

  fetchPayrolls() {
    this.payrollService.getAllPayrolls().subscribe(
      data => this.payrolls = data,
      error => console.error('Error fetching payrolls', error)
    );
  }

  // Additional methods for view, edit, delete
}
