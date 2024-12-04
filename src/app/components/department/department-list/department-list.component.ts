import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/hrm/department.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];

  itemsPerPage: number = 10;
  p: number = 1;

  constructor(private departmentService: DepartmentService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.getDepartments()
      .subscribe(departments => this.departments = departments);
  }

 delete(department: Department): void {
  const confirmDelete = window.confirm('Are you sure you want to delete this department?');

  if (confirmDelete) {
    this.departmentService.deleteDepartment(department._id).subscribe(
      () => {
        this.departments = this.departments.filter(d => d !== department);
        this.toastr.success('Department deleted successfully.', 'Success');
      },
      (error) => {
        this.toastr.error('Error deleting department.', 'Error');
        console.error('Error deleting department:', error);
      }
    );
  }
}

  editDepartment(_id: string): void {
    this.router.navigate(['/department-edit', _id]);
  }
}
