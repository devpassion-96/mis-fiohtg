import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { Employee } from "src/app/models/employee.model";
import { UserProfileService } from "./user-profile.service";

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser = new BehaviorSubject<Employee>(null);

  constructor(private userProfileService: UserProfileService) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData) {
          this.currentUser.next(userData);
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  getCurrentUser(): Observable<Employee> {
    return this.currentUser.asObservable();
  }

  getCurrentStaffId(): Observable<string> {
    return this.getCurrentUser().pipe(map(user => user ? user.staffId : null));
  }
}
