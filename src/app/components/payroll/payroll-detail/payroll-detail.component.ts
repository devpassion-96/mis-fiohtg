import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Payroll } from 'src/app/models/payroll.model';
import { PayrollService } from 'src/app/services/hrm/payroll.service';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.css']
})
export class PayrollDetailComponent implements OnInit {
  payroll: Payroll | null = null;

  constructor(
    private route: ActivatedRoute,
    private payrollService: PayrollService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const payrollId = params.get('id');
      if (payrollId) {
        this.payrollService.getPayrollById(payrollId).subscribe(
          data => this.payroll = data,
          error => {
            console.error('Error fetching payroll:', error);
            this.toastr.error('Error fetching payroll details');
          }
        );
      }
    });
  }
}
