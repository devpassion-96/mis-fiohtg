import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  username: string;
  password: string;
  errorMessage: string;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private authService: AuthService, private router: Router,
    private toastr: ToastrService,private userProfileService: UserProfileService,) { }

  ngOnInit(): void {

  }

  onLogin() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials.username, credentials.password);
  }

  // onLogin() {
  //   const credentials = {
  //     username: this.username,
  //     password: this.password
  //   };

  //   this.authService.login(credentials).subscribe(
  //     response => {

  //       this.userProfileService.getUserProfile();
  //       console.log('Login successful', response);

  //       // Decode the token to extract the role
  //       const decodedToken = jwtDecode((<any>response).token) as any;
  //       const userRole = decodedToken.role;



  //       // Store the token and role in local storage
  //       localStorage.setItem('authToken', (<any>response).token);
  //       localStorage.setItem('userRole', userRole);

  //       console.log('USER ROLE', userRole);


  //       // Navigate to the dashboard or user profile
  //       this.router.navigate(['/dashboard']);
  //       this.toastr.success('Login successful');
  //     },
  //     error => {
  //       console.error('Error during login', error);
  //       this.errorMessage = 'Invalid username or password'; // Display this error message in the HTML
  //     }
  //   );
  // }
}
