import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // If using Toastr for notifications
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
 

  vehicles: Vehicle[] = [];
  newVehicle: Vehicle = { vehicleNumber: '', status: 'Available' };
  isEditing = false;
  vehicleToEdit?: Vehicle;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(data => {
      this.vehicles = data;
    });
  }

  addVehicle(): void {
    this.vehicleService.createVehicle(this.newVehicle).subscribe(vehicle => {
      this.vehicles.push(vehicle);
      this.newVehicle = { vehicleNumber: '', status: 'Available' };  // Reset form
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.isEditing = true;
    this.vehicleToEdit = { ...vehicle };
  }

  updateVehicle(): void {
    if (this.vehicleToEdit) {
      this.vehicleService.updateVehicle(this.vehicleToEdit).subscribe(updatedVehicle => {
        const index = this.vehicles.findIndex(v => v._id === updatedVehicle._id);
        if (index > -1) {
          this.vehicles[index] = updatedVehicle;
        }
        this.isEditing = false;
        this.vehicleToEdit = undefined;
      });
    }
  }

  deleteVehicle(id: string): void {
    this.vehicleService.deleteVehicle(id).subscribe(() => {
      this.vehicles = this.vehicles.filter(v => v._id !== id);
    });
  }
}
