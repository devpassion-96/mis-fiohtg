import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  constructor(private http: HttpClient, private router: Router)
  {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
   }

   getUserProfile() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    };

    return this.http.get(`${this.baseUrl}/profile`, httpOptions)
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(
        data => this.userSubject.next(data),
        error => console.error('Error fetching user profile:', error)
      );
  }

  getCurrentUserData() {
    return this.user.pipe(
      filter(userData => userData != null), // Ensure that user data is not null
      take(1) // Take only one value and complete the observable
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Token is invalid or expired, handle logout
      this.handleLogout();
    }
    return throwError(error);
  }

  private handleLogout() {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    this.userSubject.next(null);
    // Redirect to login or home page
    this.router.navigate(['/login']);
  }


}
