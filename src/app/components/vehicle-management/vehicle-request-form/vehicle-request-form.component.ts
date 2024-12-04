import { Component } from '@angular/core';
import { VehicleRequests } from 'src/app/models/vehicle-management/vehicle-requests.model';
import { VehicleManagementService } from 'src/app/services/vehicle-management.service';

@Component({
  selector: 'app-vehicle-request-form',
  templateUrl: './vehicle-request-form.component.html',
  styleUrls: ['./vehicle-request-form.component.css']
})
export class VehicleRequestsFormComponent {
  request: Partial<VehicleRequests> = {
    officerId: '',
    vehicleTypeRequested: '',
  };

  constructor(private apiService: VehicleManagementService) {}

  createRequest() {
    this.apiService.createRequest(this.request as VehicleRequests).subscribe({
      next: (response) => alert('Request created successfully!'),
      error: (err) => console.error('Error creating request:', err),
    });
  }

  
}
