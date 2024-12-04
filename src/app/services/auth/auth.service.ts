import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;

    // BehaviorSubject to track user state
    private currentUserSubject = new BehaviorSubject<any>(null);
    currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {

    const token = localStorage.getItem('authToken');
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
   }

  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // login(credentials: any) {
  //   return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
  //     tap((response: any) => {
  //       localStorage.setItem('authToken', response.token);
  //       localStorage.setItem('userData', JSON.stringify(response.userData)); // Store user data
  //     })
  //   );
  // }

  // login(credentials: any) {
  //   return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
  //     tap((response: any) => {
  //       console.log('Login Response:', response); // Debugging line
  //       if (response.token && response.userData) {
  //         localStorage.setItem('authToken', response.token);
  //         localStorage.setItem('userData', JSON.stringify(response.userData));
  //         console.log('Auth Token and User Data saved to localStorage');
  //       } else {
  //         console.error('Login response missing token or userData.');
  //       }
  //     })
  //   );
  // }

  // login(username: string, password: string) {
  //   return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).subscribe(
  //     (response) => {
  //       localStorage.setItem('authToken', response.token); // Save token in localStorage
  //       this.router.navigate(['/dashboard']); // Navigate after login
  //     },
  //     (error) => {
  //       alert('Login failed: ' + error.error.message);
  //     }
  //   );
  // }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).subscribe(
      (response) => {
        localStorage.setItem('authToken', response.token); // Save token
        const user = this.decodeToken(response.token); // Decode token to extract user data
        this.currentUserSubject.next(user); // Update BehaviorSubject
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        alert('Login failed: ' + error.error.message);
      }
    );
  }
  


  // logout() {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('userData'); // Clear user data
  // }

  logout() {
    localStorage.removeItem('authToken'); // Clear token
    this.currentUserSubject.next(null); // Reset user state
    this.router.navigate(['/login']);
  }

  // getCurrentUserData() {
  //   const userData = localStorage.getItem('userData');
  //   return userData ? JSON.parse(userData) : null;
  // }

  getCurrentUserData() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    // Decode JWT (for role extraction if necessary, using jwt-decode library)
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Simple decoding
      return { id: decoded.id, role: decoded.role, department: decoded.department,staffId: decoded.staffId };
    } catch {
      return null;
    }
  }
  

  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  private decodeToken(token: string) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      return { id: decoded.id, role: decoded.role, department: decoded.department,staffId: decoded.staffId }; // Return user object
    } catch {
      return null;
    }
  }
}
