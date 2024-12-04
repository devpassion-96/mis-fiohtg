import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';

import { MeetingMinutes } from 'src/app/models/messaging-feature/minutes.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { MeetingMinutesService } from 'src/app/services/messaging-feature/meetings.service';

@Component({
  selector: 'app-meeting-minutes-detail',
  templateUrl: './meeting-minutes-detail.component.html',
  styleUrls: ['./meeting-minutes-detail.component.css']
})
export class MeetingMinutesDetailComponent implements OnInit {
  meetingMinute: MeetingMinutes;
  employees: Employee[] = [];

  constructor(
    private route: ActivatedRoute, private employeeService: EmployeeService,
    private meetingMinutesService: MeetingMinutesService
  ) {}

  ngOnInit(): void {
    this.loadMeetingMinuteDetails();
    this.loadEmployees();
  }

  loadMeetingMinuteDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.meetingMinutesService.getMeetingMinutesById(id).subscribe(
        (meetingMinuteData: MeetingMinutes) => {
          this.meetingMinute = meetingMinuteData;
        },
        (error) => {
          console.error('Error fetching meeting minute details:', error);
        }
      );
    }
  }
  getEmployeeNameByStaffId(staffId: string): string {
    const employee = this.employees.find(emp => emp.staffId === staffId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      employees => {
        this.employees = employees;
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  getEmployeeNameById(staffId: string): string {
    const employee = this.employees.find(e => e.staffId === staffId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  print() {
    setTimeout(() => window.print(), 1000); // Trigger print after data is loaded
  }
}
