import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {
  // vehicle: Vehicle | null = null;

  // constructor(
  //   private route: ActivatedRoute,
  //   private vehicleService: VehicleService
  // ) {}

  // ngOnInit() {
  //   const vehicleId = this.route.snapshot.paramMap.get('id');
  //   if (vehicleId) {
  //     this.vehicleService.getVehicleById(vehicleId).subscribe({
  //       next: (data) => this.vehicle = data,
  //       error: () => console.error('Error fetching vehicle data')
  //     });
  //   }
  // }

  vehicle?: Vehicle;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const vehicleId = (this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getVehicle(vehicleId).subscribe(data => {
      this.vehicle = data;
    });
  }
}
