import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  employees: Employee[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      staffId: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      password: ['', Validators.required], // Password is not auto-populated
      address: [{ value: '', disabled: true }, Validators.required],
      telephone: [{ value: '', disabled: true }, Validators.required],
      department: [{ value: '', disabled: true }, Validators.required],
      role: [{ value: ''}, Validators.required]
    });

    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });

    this.registerForm.get('staffId').valueChanges.subscribe(staffId => {
      this.onStaffSelect(staffId);
    });
  }

  onStaffSelect(staffId: string): void {
    const employee = this.employees.find(e => e.staffId === staffId);
    if (employee) {
      this.registerForm.patchValue({
        username: employee.email, // Assuming the username is the email from employee
        address: employee.city,
        telephone: employee.mobileNumber,
        department: employee.department,
        // role: '' // Assuming the role is employee by default
      });

      // Now disable the fields after setting the value
      ['username', 'address', 'telephone'].forEach(field => {
        this.registerForm.get(field).disable();
      });
    }
  }

  onRegister() {
    this.submitted = true;
    if (this.registerForm.valid) {
      // Enable fields to get their values
      ['username', 'address', 'department', 'telephone', 'role'].forEach(field => {
        this.registerForm.get(field).enable();
      });

      const formData = this.registerForm.getRawValue();

      // Disable again after getting the value if you want to prevent them from being edited
      ['username', 'address','department', 'telephone', 'role'].forEach(field => {
        this.registerForm.get(field).disable();
      });

      this.authService.register(formData).subscribe(
        response => {
          this.toastr.success('Registration successful!', 'Success');
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.toastr.error('Registration failed. User available.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}
