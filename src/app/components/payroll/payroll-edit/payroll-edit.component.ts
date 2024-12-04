import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayrollService } from 'src/app/services/hrm/payroll.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payroll-edit',
  templateUrl: './payroll-edit.component.html',
  styleUrls: ['./payroll-edit.component.css']
})
export class PayrollEditComponent implements OnInit {
  payrollForm: FormGroup;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private router: Router, private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.payrollForm = this.fb.group({
      staffId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      bonuses: [0, Validators.min(0)],
      deductions: [0, Validators.min(0)],
      netSalary: [{value: 0, disabled: true}],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.payrollService.getPayrollById(this.id).subscribe({
      next: (payroll) => this.payrollForm.patchValue(payroll),
      error: (err) => console.error('Error fetching payroll:', err)
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
      this.payrollService.updatePayroll(this.id, this.payrollForm.getRawValue()).subscribe({
        next: () => {
          this.toastr.success('Payroll record updated successfully', 'Success');
          this.router.navigate(['/payroll-list']);
        },
        error: (err) => {
          console.error('Error updating payroll:', err);
          this.toastr.error('Error updating payroll record', 'Error');
        }
      });
    } else {
      console.error('Form is not valid');
      this.toastr.error('Invalid form data', 'Error');
    }
  }
}
