import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { Department } from 'src/app/models/department.model';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.css']
})
export class DepartmentAddComponent implements OnInit {
  departmentForm: FormGroup;
  departmentId: string | null = null;

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      designations:this.fb.array([])
    });

    // Check if departmentId is passed
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.departmentId = id;
        this.departmentService.getDepartmentById(this.departmentId).subscribe(department => {
          this.departmentForm.patchValue(department);
          this.populateDesignations(department.designations);
        });
      }
    });
  }

  get designations(): FormArray {
    return this.departmentForm.get('designations') as FormArray;
  }


  populateDesignations(designations: any[]) {
    const designationFormGroups = designations.map(designation =>
      this.fb.group({
        id: [designation.id],
        title: [designation.title, Validators.required],
        departmentId: [this.departmentId]
      })
    );
    const designationFormArray = this.fb.array(designationFormGroups);
    this.departmentForm.setControl('designations', designationFormArray);
  }

  addDesignation() {
    const designationGroup = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      departmentId: [this.departmentId]
    });
    this.designations.push(designationGroup);
  }

  removeDesignation(index: number) {
    this.designations.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;
    if (this.departmentForm.valid) {
      const departmentData: Department = this.departmentForm.value;

      // When adding a new department, departmentId will be undefined initially
      if (!this.departmentId) {
        this.departmentService.addDepartment(departmentData).subscribe((newDepartment) => {
          // Set departmentId for each designation
          const updatedDesignations = newDepartment.designations.map(designation => ({
            ...designation,
            departmentId: newDepartment._id
          }));

          // Update the department with the correct designation references
          this.departmentService.updateDepartment({...newDepartment, designations: updatedDesignations})
            .subscribe(() => {
              this.router.navigate(['/department-list']);
              this.toastr.success('Department Created', 'Success');
            });
        });
      } else {
        // Update existing department
        this.departmentService.updateDepartment({ ...departmentData, _id: this.departmentId })
          .subscribe(() => {
            this.router.navigate(['/department-list']);
            this.toastr.success('Department Updated', 'Success');
          });
      }
    }
  }


}
