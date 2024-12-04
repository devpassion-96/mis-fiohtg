import { Component } from '@angular/core';
import { Driver } from 'src/app/models/vehicle-management/driver.model';
import { VehicleManagementService } from 'src/app/services/vehicle-management.service';

@Component({
  selector: 'app-driver-status',
  templateUrl: './driver-status.component.html',
  styleUrls: ['./driver-status.component.css']
})
export class DriverStatusComponent {

  drivers: Driver[] = [];

  constructor(private apiService: VehicleManagementService) {}

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getDrivers().subscribe((data) => {
      this.drivers = data;
    });
  }
}
