import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { DailyPermissionService } from 'src/app/services/hrm/daily-permission.service';

@Component({
  selector: 'app-daily-permission-form',
  templateUrl: './daily-permission-form.component.html',
  styleUrls: ['./daily-permission-form.component.css']
})
export class DailyPermissionFormComponent implements OnInit {
  permissionForm: FormGroup;
  user: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private permissionService: DailyPermissionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      staffId: ['', Validators.required],
      date: [new Date(), Validators.required],
      reason: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      status: ['Pending', Validators.required],
      supervisorComments: ['']
    });
    this.populateStaffId();
  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.permissionForm.patchValue({ staffId: userData.staffId });
        }
      },
      (error) => console.error('Error fetching user profile:', error)
    );

    if (!this.user) {
      this.userProfileService.getUserProfile();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.permissionForm.valid) {
      const formData = this.permissionForm.value;

      // Convert timeFrom and timeTo to Date objects
      const date = new Date(formData.date); // Assuming date is already in Date format
      const timeFrom = new Date(date.getTime());
      const timeTo = new Date(date.getTime());

      // Split the time string into hours and minutes
      const [hoursFrom, minutesFrom] = formData.timeFrom.split(':').map(str => parseInt(str, 10));
      const [hoursTo, minutesTo] = formData.timeTo.split(':').map(str => parseInt(str, 10));

      // Set hours and minutes for timeFrom and timeTo
      timeFrom.setHours(hoursFrom, minutesFrom);
      timeTo.setHours(hoursTo, minutesTo);

      const permissionRequest = {
        ...formData,
        staffId: this.user.staffId,
        date: formData.date, // Use the date from the form
        timeFrom: timeFrom,
        timeTo: timeTo
      };

      this.permissionService.addPermission(permissionRequest).subscribe({
        next: () => {
          this.toastr.success('Permission Request Sent', 'Success');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error submitting permission:', err);
          this.toastr.error('Failed to submit permission request');
        }
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }
}
