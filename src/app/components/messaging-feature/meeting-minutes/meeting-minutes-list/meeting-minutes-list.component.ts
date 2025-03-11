import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { MeetingMinutes } from 'src/app/models/messaging-feature/minutes.model';
import { AuthService } from 'src/app/services/auth/auth.service';
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

  itemsPerPage: number = 10;
  p: number = 1;

  userRole: string; // To store the role of the logged-in user
  
  userDepartment: string;
  userStaffId: string;

  constructor(private meetingMinutesService: MeetingMinutesService,
    private employeeService: EmployeeService,private authService: AuthService,
    private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.loadMeetingMinutes();
    this.loadAllEmployees();
    this.loadUserRole();
  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role; // Role of the user
      this.userDepartment = userData.department; // Department for managers
      this.userStaffId = userData.staffId; // Staff ID for employees
    } else {
      this.userRole = 'Employee';
    }
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
