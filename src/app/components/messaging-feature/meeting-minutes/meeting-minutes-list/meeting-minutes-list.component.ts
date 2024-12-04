import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { MeetingMinutes } from 'src/app/models/messaging-feature/minutes.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { MeetingMinutesService } from 'src/app/services/messaging-feature/meetings.service';

@Component({
  selector: 'app-meeting-minutes-list',
  templateUrl: './meeting-minutes-list.component.html',
  styleUrls: ['./meeting-minutes-list.component.css']
})
export class MeetingMinutesListComponent implements OnInit {
  meetingMinutesList: MeetingMinutes[] = [];
  employees: Employee[] = [];

  constructor(private meetingMinutesService: MeetingMinutesService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.loadMeetingMinutes();
    this.loadAllEmployees()
  }

  loadMeetingMinutes() {
    this.meetingMinutesService.getAllMeetingMinutesRecords().subscribe(
      (meetingMinutesData: MeetingMinutes[]) => {
        this.meetingMinutesList = meetingMinutesData;
      },
      (error) => {
        console.error('Error fetching meeting minutes:', error);
      }
    );
  }
  loadAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: () => {
        this.toastr.error('Error fetching employees');
      }
    });
  }

  getEmployeeNameByStaffId(staffId: string): string {
    const employee = this.employees.find(emp => emp.staffId === staffId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  viewMeetingMinuteDetails(meetingMinuteId: number) {
    // Route to the meeting minute details page with the meetingMinuteId
    this.router.navigate(['/meeting-minute-details', meetingMinuteId]);
  }

  editMeetingMinute(meetingMinuteId: number) {
    // Navigate to the edit page with the meeting minute's ID as a parameter
    this.router.navigate(['meeting-minutes-edit', meetingMinuteId]);
  }
}
