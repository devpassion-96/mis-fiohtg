import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayrollService } from 'src/app/services/hrm/payroll.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payroll-adjustment',
  templateUrl: './payroll-adjustment.component.html',
  styleUrls: ['./payroll-adjustment.component.css']
})
export class PayrollAdjustmentComponent implements OnInit {
  adjustmentForm: FormGroup;

  constructor(private fb: FormBuilder,
              private payrollService: PayrollService,
              private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.adjustmentForm = this.fb.group({
      staffId: ['', Validators.required],
      bonuses: [0, Validators.required],
      deductions: [0, Validators.required]
    });
  }

  // onSubmit() {
  //   if (this.adjustmentForm.valid) {
  //     this.payrollService.addAdjustment(this.adjustmentForm.value).subscribe({
  //       next: () => {
  //         this.toastr.success('Adjustment Saved', 'Success');
  //         this.router.navigate(['/payroll-list']);
  //         // Additional logic...
  //       },
  //       error: (err) => {
  //         this.toastr.error('Error saving adjustment', 'Error');
  //         console.error('Error:', err);
  //       }
  //     });
  //   }
  // }

  onSubmit() {
    if (this.adjustmentForm.valid) {
      const payrollId = this.adjustmentForm.get('staffId').value; // Assuming payroll ID is available
      this.payrollService.updatePayroll(payrollId, this.adjustmentForm.value).subscribe({
        next: () => {
          this.toastr.success('Payroll Updated Successfully', 'Success');
          // Redirect or refresh component as needed
          this.router.navigate(['/payroll-list']);
        },
        error: err => {
          this.toastr.error('Error updating payroll', 'Error');
          console.error('Error:', err);
        }
      });
    }
}

}
