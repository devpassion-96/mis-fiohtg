import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  drivers: Driver[] = [];
  newDriver: Driver = { name: '', status: 'Available' };
  isEditing = false;
  driverToEdit?: Driver;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe(data => {
      this.drivers = data;
    });
  }

  addDriver(): void {
    this.driverService.createDriver(this.newDriver).subscribe(driver => {
      this.drivers.push(driver);
      this.newDriver = { name: '', status: 'Available' };  // Reset form
    });
  }

  editDriver(driver: Driver): void {
    this.isEditing = true;
    this.driverToEdit = { ...driver };
  }

  updateDriver(): void {
    if (this.driverToEdit) {
      this.driverService.updateDriver(this.driverToEdit).subscribe(updatedDriver => {
        const index = this.drivers.findIndex(d => d._id === updatedDriver._id);
        if (index > -1) {
          this.drivers[index] = updatedDriver;
        }
        this.isEditing = false;
        this.driverToEdit = undefined;
      });
    }
  }

  deleteDriver(id: string): void {
    this.driverService.deleteDriver(id).subscribe(() => {
      this.drivers = this.drivers.filter(d => d._id !== id);
    });
  }
}
