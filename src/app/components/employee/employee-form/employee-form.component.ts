import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { EmployeeService } from 'src/app/services/hrm/employee.service';

import { DepartmentService } from 'src/app/services/hrm/department.service';
import { Department } from 'src/app/models/department.model';
import { Designation } from 'src/app/models/designation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  @Input() employee: Employee | null = null; // Initialize with null
  @Output() formSubmit = new EventEmitter<Employee>();
  employeeForm!: FormGroup;

  isEditMode: boolean = false;

  submitted = false;

  departments: Department[] = [];
designations: Designation[] = [];

  constructor( private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {}

  ngOnInit() {

    this.loadDepartments();

    this.route.paramMap.subscribe(params => {
      const employeeId = params.get('id');
      if (employeeId) {
        this.isEditMode = true;
        this.loadEmployeeData(employeeId);
      } else {
        this.isEditMode = false;
        this.initForm();
      }

    });
  }

  loadEmployeeData(id: string) {
    this.employeeService.getEmployeeById(id).subscribe(
      (employeeData) => {
        this.employee = employeeData;
        this.initForm(employeeData);
      },
      (error) => {
        console.error('Error loading employee data:', error);
        // Handle the error appropriately
      }
    );
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      console.log('Loaded departments:', this.departments);
    });
  }




  initForm(employee?: Employee) {
    this.employeeForm = this.fb.group({
      staffId: [employee?.staffId || '', Validators.required],
      firstName: [employee?.firstName || '', Validators.required],
      lastName: [employee?.lastName || '', Validators.required],
      gender: [employee?.gender || '', Validators.required],
      dateOfBirth: [this.formatDate(employee?.dateOfBirth) || '',],
      city: [employee?.city || '', Validators.required],
      mobileNumber: [employee?.mobileNumber || '', Validators.required],
      email: [employee?.email || '', [Validators.required, Validators.email]],
      remarks: [employee?.remarks || ''],
      appointmentDate: [this.formatDate(employee?.appointmentDate) || ''],
      designation: [employee?.designation || '', Validators.required],
      department: [employee?.department || '', Validators.required],
      grade: [employee?.grade || '', [Validators.required, Validators.min(1)]],
      point: [employee?.point || '', [Validators.required, Validators.min(1)]],
      nationalIdentificationNumber: [employee?.nationalIdentificationNumber || '', Validators.required],
      tinNumber: [employee?.tinNumber || ''],
      sshfcNumber: [employee?.sshfcNumber || ''],
      staffType: [employee?.staffType || '', Validators.required],
      staffStatus: [employee?.staffStatus || '', Validators.required],
      basicSalary: [employee?.basicSalary || '', [Validators.required, Validators.min(0)]],
      probationEndDate: [this.formatDate(employee?.probationEndDate) || ''],
      image: [employee?.image || 'image place'],
      dependents: this.fb.array([])
    });


    this.employeeForm.get('department').valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.onDepartmentChange(departmentId);
      } else {
        this.designations = [];
      }
    });

     // If we are in edit mode, we need to ensure the designations are set correctly
  if (employee) {
    const selectedDepartment = this.departments.find(dept => dept._id === employee.department);
    this.designations = selectedDepartment ? selectedDepartment.designations : [];
    this.employeeForm.patchValue({
      designation: employee.designation
    });
  }

    if (employee && employee.dependents) {
      const dependentsArray = this.employeeForm.get('dependents') as FormArray;
      employee.dependents.forEach(dep => {
        dependentsArray.push(this.fb.group({
          dependentFirstName: [dep.dependentFirstName],
          dependentLastName: [dep.dependentLastName],
          dependentDOB: [this.formatDate(dep.dependentDOB)],
          dependentGender: [dep.dependentGender],
          dependentRelationship: [dep.dependentRelationship]
        }));
      });



    }
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }
  generateStaffId() {
    const { firstName, lastName, dateOfBirth, mobileNumber } = this.employeeForm.value;
    const partFirstName = firstName?.substring(0, 2).toLowerCase();
    const partLastName = lastName?.substring(0, 2).toLowerCase();
    const partDOB = dateOfBirth?.replace(/-/g, '').substring(2);
    const partMobile = mobileNumber?.substring(mobileNumber.length - 4);
    const uniqueString = new Date().getTime().toString().substring(8);

    return `${partFirstName}${partDOB}${partLastName}${partMobile}${uniqueString}`;
  }



onDepartmentChange(departmentId: string) {
  const selectedDepartment = this.departments.find(dept => dept._id === departmentId);
  console.log('Selected department:', selectedDepartment); // Debugging line
  this.designations = selectedDepartment ? selectedDepartment.designations : [];
  console.log('Updated designations:', this.designations); // Debugging line
}


onSubmit() {
  this.submitted = true;

  // Generate unique staffId
  const generatedStaffId = this.generateStaffId();
  this.employeeForm.patchValue({ staffId: generatedStaffId });

  if (this.employeeForm.valid) {
    const { email, nationalIdentificationNumber } = this.employeeForm.value;
    const currentEmployeeId = this.isEditMode && this.employee ? this.employee._id : undefined;

    // Check for duplicate employee
    this.employeeService.checkDuplicateEmployee(email, nationalIdentificationNumber, currentEmployeeId).subscribe({
      next: (duplicates) => {
        if (duplicates.length > 0) {
          this.toastr.error('Duplicate employee found', 'Error');
        } else {
          if (this.isEditMode && this.employee && this.employee._id) {
            const updateValues = { ...this.employeeForm.value };
            delete updateValues.staffId; // Exclude staffId from update

            this.employeeService.updateEmployee(this.employee._id, updateValues).subscribe({
              next: () => {
                this.router.navigate(['/employee-list']);
                this.toastr.success('Employee Record Updated', 'Success');
              },
              error: (err) => {
                console.error('Error updating employee:', err);
                this.toastr.error('Error updating employee', 'Error');
              }
            });
          } else {
            this.employeeService.addEmployee(this.employeeForm.value).subscribe({
              next: () => {
                this.router.navigate(['/employee-list']);
                this.toastr.success('Employee Record Created', 'Success');
              },
              error: (err) => {
                console.error('Error adding employee:', err);
                this.toastr.error('Error adding employee', 'Error');
              }
            });
          }
        }
      },
      error: (error) => {
        console.error('Error checking for duplicates:', error);
        this.toastr.error('Error checking for duplicates', 'Error');
      }
    });
  } else {
    console.log('Form Errors:', this.getFormValidationErrors());
  }
}






  getFormValidationErrors() {
    const errors: any[] = [];
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      if (control && control.errors) {
        Object.keys(control.errors).forEach(keyError => {
          errors.push({
            'control': key,
            'error': keyError,
            'value': control.errors[keyError]
          });
        });
      }
    });
    return errors;
  }



  // Method to dynamically add dependent fields
  addDependent() {
    const dependentsForm = this.employeeForm.get('dependents') as FormArray;
    const newDependent = this.fb.group({
      dependentFirstName: [''],
      dependentLastName: [''],
      dependentDOB: [''],
      dependentGender: [''],
      dependentRelationship: ['']
    });
    dependentsForm.push(newDependent);
  }

  get dependents(): FormArray {
    return this.employeeForm.get('dependents') as FormArray;
  }


  // Method to remove a dependent field
  removeDependent(index: number) {
    const dependentsForm = this.employeeForm.get('dependents') as FormArray;
    dependentsForm.removeAt(index);
  }
}
