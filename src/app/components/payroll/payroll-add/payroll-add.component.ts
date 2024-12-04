import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PayrollService } from 'src/app/services/hrm/payroll.service';

@Component({
  selector: 'app-payroll-add',
  templateUrl: './payroll-add.component.html',
  styleUrls: ['./payroll-add.component.css']
})
export class PayrollAddComponent implements OnInit {
  payrollForm: FormGroup;

  constructor(private fb: FormBuilder, private payrollService: PayrollService, private router: Router) {}

  ngOnInit(): void {
    this.payrollForm = this.fb.group({
      staffId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      bonuses: [0, Validators.min(0)],
      deductions: [0, Validators.min(0)],
      netSalary: [{value: 0, disabled: true}],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.payrollForm.valueChanges.subscribe(formData => {
      this.payrollForm.controls['netSalary'].setValue(
        formData.basicSalary + formData.bonuses - formData.deductions,
        { emitEvent: false }
      );
    });
  }

  onSubmit() {
    if (this.payrollForm.valid) {
      this.payrollService.addPayroll(this.payrollForm.getRawValue()).subscribe({
        next: () => this.router.navigate(['/payroll-list']),
        error: (err) => console.error('Error adding payroll:', err)
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
