import { Component } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle-management/vehicle.model';
import { VehicleManagementService } from 'src/app/services/vehicle-management.service';

@Component({
  selector: 'app-vehicle-status',
  templateUrl: './vehicle-status.component.html',
  styleUrls: ['./vehicle-status.component.css']
})
export class VehicleStatusComponent {
  vehicles: Vehicle[] = [];

  constructor(private apiService: VehicleManagementService) {}

  ngOnInit() {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.apiService.getVehicles().subscribe((data) => {
      this.vehicles = data;
    });
  }
}
