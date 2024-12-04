import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  activeTab = 'basic';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const employeeId = params.get('id');
      if (employeeId) {
        this.loadEmployeeDetails(employeeId);
      }
    });
  }

  loadEmployeeDetails(_id: string) {
    this.employeeService.getEmployeeById(_id).subscribe(employee => {
      console.log('Employee data:', employee);
      this.employee = employee;
    }, error => {
      console.error('Error fetching employee:', error);
    });
  }

  toggleTab(tabName: string) {
    console.log("Switching to tab: ", tabName);
    console.log("Current employee data: ", this.employee);
    this.activeTab = tabName;
  }



}
