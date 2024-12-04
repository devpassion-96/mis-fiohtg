import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { Training } from 'src/app/models/training.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { TrainingService } from 'src/app/services/hrm/training.service';

@Component({
  selector: 'app-employee-development',
  templateUrl: './employee-development.component.html',
  styleUrls: ['./employee-development.component.css']
})
export class EmployeeDevelopmentComponent implements OnInit {
  employees: Employee[] = [];
  trainings: Training[] = [];

  constructor(private employeeService: EmployeeService, private trainingService: TrainingService) {}

  ngOnInit() {
    this.fetchEmployees();
    this.fetchTrainings();
  }

  fetchEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      data => this.employees = data,
      error => console.error('Error fetching employees:', error)
    );
  }

  fetchTrainings() {
    this.trainingService.getAllTrainings().subscribe(
      data => this.trainings = data,
      error => console.error('Error fetching trainings:', error)
    );
  }

  getEmployeeTrainings(employeeId: string): Training[] {
    // Logic to filter trainings based on employeeId
    // Example: return this.trainings.filter(training => training.employeeId === employeeId);
    return []; // Replace with actual logic
  }
}
