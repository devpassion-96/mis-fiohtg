import { Component } from '@angular/core';
import { VehicleRequests } from 'src/app/models/vehicle-management/vehicle-requests.model';
import { VehicleManagementService } from 'src/app/services/vehicle-management.service';

@Component({
  selector: 'app-allocation-list',
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.css']
})
export class AllocationListComponent {

  requests: VehicleRequests[] = [];

  constructor(private apiService: VehicleManagementService) {}

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    // Fetch requests with pending approval
    // You might want to add a filter to fetch only unapproved or unallocated requests
    this.apiService.getRequests().subscribe((data) => (this.requests = data));
  }

  approveRequest(id: string) {
    this.apiService.approveRequest(id).subscribe(() => this.fetchRequests());
  }

  allocateVehicle(id: string) {
    this.apiService.allocateVehicle(id).subscribe(() => this.fetchRequests());
  }

}
