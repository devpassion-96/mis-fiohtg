import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleRequest } from 'src/app/models/vehicle-drivers/vehicle-request.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';

@Component({
  selector: 'app-vehicle-request-form',
  templateUrl: './vehicle-request-form.component.html',
  styleUrls: ['./vehicle-request-form.component.css']
})
export class VehicleRequestFormComponent implements OnInit {
  requests: VehicleRequest[] = [];
  newRequest: VehicleRequest = {
    requestingOfficer: '',
    unit: '',
    purpose: '',
    projectGoalNumber: '',
    travelingDay: '',
    returnDay: '',
    cumulativeDays: 0,
    regions: '',
    district: '',
    villages: '',
    remarks: '',
    status: 'Pending',
  };
  isEditing = false;
  requestToEdit?: VehicleRequest;

  user: any; // Store logged-in user info

  constructor(
    private requestService: VehicleRequestService,
    private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.populateRequestingOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadRequestById(id);
    }
    
  }

  populateRequestingOfficer() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;

          // Only set requestingOfficer if adding a new request
          if (!this.isEditing) {
            this.newRequest.requestingOfficer = userData.staffId;
          }
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    if (!this.user) {
      this.userProfileService.getUserProfile();
    }
  }

  loadRequestById(id: string): void {
    this.requestService.getRequest(id).subscribe(
      (request) => {
        this.requestToEdit = request;
      },
      (error) => {
        console.error('Error fetching the request:', error);
        this.router.navigate(['/']);
      }
    );
  }

  // addRequest(): void {
  //   this.requestService.createRequest(this.newRequest).subscribe(
  //     (request) => {
  //       this.requests.push(request);
  //       this.newRequest = { ...this.newRequest, status: 'Pending' }; // Reset form
  //     },
  //     (error) => console.error('Error adding the request:', error)
  //   );
  // }

  addRequest(): void {
    // Ensure requestingOfficer is set before sending the request
    this.newRequest.requestingOfficer = this.user?.staffId || '';

    this.requestService.createRequest(this.newRequest).subscribe(
      (request) => {
        this.requests.push(request);
         // Show success message and navigate to home (or any desired page)
         this.toastr.success('Request submitted', 'Success');
         this.router.navigate(['/']);
        this.newRequest = {
          requestingOfficer: this.user?.staffId || '',
          unit: '',
          purpose: '',
          projectGoalNumber: '',
          travelingDay: '',
          returnDay: '',
          cumulativeDays: 0,
          regions: '',
          district: '',
          villages: '',
          remarks: '',
          status: 'Pending'
        };
      },
      (error) => console.error('Error adding the request:', error)
    );
  }

  updateRequest(): void {
    if (this.requestToEdit) {
      this.requestService.updateRequest(this.requestToEdit).subscribe(
        (updatedRequest) => {
          const index = this.requests.findIndex(
            (r) => r._id === updatedRequest._id
          );
          if (index > -1) {
            this.requests[index] = updatedRequest;
          }
          this.isEditing = false;
          this.requestToEdit = undefined;
        },
        (error) => console.error('Error updating the request:', error)
      );

      this.router.navigate(['/']);
    }
  }
}
