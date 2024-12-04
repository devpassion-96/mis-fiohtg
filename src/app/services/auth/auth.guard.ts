import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);  // Assuming this.jwtDecode is your working method
      const userRole = decoded.role;
      console.log("decoded user role from guard: ",userRole);

      // if (expectedRole === userRole) {
      //   return true;
      // }
      if (!expectedRole || expectedRole === userRole) {
        return true;
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
    }

    this.router.navigate(['/login']);  // Redirect to an unauthorized page
    return false;
  }

  // Assuming you have a working jwtDecode method elsewhere in your service
  jwtDecode(token: string) {
    // your implementation
  }
}

interface DecodedToken {
  role: string;
  department: string;
  staffId: string;
  // Add other properties if your token has more fields
}
