import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { jwtDecode } from 'jwt-decode';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // user: any;
  userRole: string;
  requests: Request[] = [];

  userDepartment: string;
  userStaffId: string;

  private apiUrl = `${environment.apiUrl}/auth/profile`;
  // Use BehaviorSubject to store and emit user data
  private userSubject = new BehaviorSubject<any>(null);
  // user = this.userSubject.asObservable();

  user$: Observable<any>; // Observable for user

  constructor(private http: HttpClient,private leavesService: LeavesService,
    private requestService: RequestService,private permissionRequestService: DailyPermissionService,
    private projectService: ProjectService,
    private employeeService: EmployeeService, public authService: AuthService, private router: Router,private userProfileService: UserProfileService) { }

    ngOnInit() {
      // Assign the observable directly
      this.user$ = this.userProfileService.user;
  
      // Fetch the user profile on component initialization
      this.userProfileService.getUserProfile();

      // get the user role
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


  requestsFn(){
    this.requestService.getAllRequestRecords().subscribe(data => {
      // this.requests = data;
      // this.filteredEmployees = data; // Initially, filtered list is the full list
    });

    // this.requests = mappedRequests.filter(request => request.status === 'M&EReview');;

  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.userSubject.next(null); // Emit null if no token
      return;
    }

    this.http.get(this.apiUrl).subscribe(
      (userData) => {
        this.userSubject.next(userData); // Emit user data
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        this.userSubject.next(null); // Clear user data on error
      }
    );
  }

  clearUser() {
    this.userSubject.next(null); // Clear user data on logout
  }




}


interface DecodedToken {
  role: string;
}
