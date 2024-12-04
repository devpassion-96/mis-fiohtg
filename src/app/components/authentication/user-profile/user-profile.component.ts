import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit() {
    // Subscribe to the user observable to get user data
    this.userProfileService.user.subscribe(
      (userData) => {
        // Only update the user if data is present
        if (userData) {
          this.user = userData;
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    // Optionally, trigger fetching user profile if it's not already loaded
    if (!this.user) {
      this.userProfileService.getUserProfile();
    }
  }
}
