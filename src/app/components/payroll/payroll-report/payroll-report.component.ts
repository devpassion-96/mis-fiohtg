import { Component, OnInit } from '@angular/core';
import { Payroll } from 'src/app/models/payroll.model';
import { PayrollService } from 'src/app/services/hrm/payroll.service';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styleUrls: ['./payroll-report.component.css']
})
export class PayrollReportComponent implements OnInit {
  payrollData: Payroll[] = [];

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.payrollService.getAllPayrolls().subscribe(
      data => this.payrollData = data,
      error => console.error('Error fetching payrolls:', error)
    );
  }

  calculateTotalExpenditure() {
    let total = 0;
    this.payrollData.forEach(payroll => {
      total += payroll.netSalary; // Assuming netSalary includes all deductions and bonuses
    });
    return total;
  }
}
