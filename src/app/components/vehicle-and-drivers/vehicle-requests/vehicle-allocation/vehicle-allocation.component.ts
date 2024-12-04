import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { VehicleRequest } from 'src/app/models/vehicle-drivers/vehicle-request.model';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-vehicle-allocation',
  templateUrl: './vehicle-allocation.component.html',
  styleUrls: ['./vehicle-allocation.component.css']
})
export class VehicleAllocationComponent implements OnInit {
  // allocationForm: FormGroup;
  // approvedRequests: VehicleRequest[] = [];
  // availableVehicles: Vehicle[] = [];
  // availableDrivers: Driver[] = [];

  // constructor(
  //   private fb: FormBuilder,
  //   private vehicleRequestService: VehicleRequestService,
  //   private vehicleService: VehicleService,
  //   private driverService: DriverService,
  //   private toastr: ToastrService
  // ) {}

  // ngOnInit() {
  //   this.allocationForm = this.fb.group({
  //     requestId: ['', Validators.required],
  //     vehicleId: ['', Validators.required],
  //     driverId: ['', Validators.required]
  //   });

  //   this.loadApprovedRequests();
  //   this.loadAvailableVehicles();
  //   this.loadAvailableDrivers();
  // }

  // loadApprovedRequests() {
  //   this.vehicleRequestService.getAllVehicleRequestRecords().subscribe(
  //     requests => {
  //       this.approvedRequests = requests
  //       // this.approvedRequests = requests.filter(request => request.status === 'Approved');
  //     },
  //     error => {
  //       console.error('Error loading vehicle requests:', error);
  //       this.toastr.error('Error loading vehicle requests');
  //     }
  //   );
  // }


  // loadAvailableVehicles() {
  //   this.vehicleService.getAllVehicleRecords().subscribe(
  //     vehicles => {
  //       this.availableVehicles = vehicles;
  //       // this.availableVehicles = vehicles.filter(vehicle => vehicle.status === 'Available');
  //     },
  //     error => {
  //       console.error('Error loading vehicles:', error);
  //       this.toastr.error('Error loading vehicles');
  //     }
  //   );
  // }

  // loadAvailableDrivers() {
  //   this.driverService.getAllDriverRecords().subscribe(
  //     drivers => {
  //       // this.availableDrivers = drivers;
  //       this.availableDrivers = drivers.filter(driver => driver.status === 'Available');
  //     },
  //     error => {
  //       console.error('Error loading drivers:', error);
  //       this.toastr.error('Error loading drivers');
  //     }
  //   );
  // }


  // onAllocate() {
  //   if (this.allocationForm.valid) {
  //     const { requestId, vehicleId, driverId } = this.allocationForm.value;

  //     // Find the current state of the request, vehicle, and driver
  //     const currentRequest = this.approvedRequests.find(req => req.id === requestId);
  //     const currentVehicle = this.availableVehicles.find(veh => veh.id === vehicleId);
  //     const currentDriver = this.availableDrivers.find(drv => drv.id === driverId);

  //     if (currentRequest && currentVehicle && currentDriver) {
  //       // Update Vehicle Request
  //       const updatedRequest = { ...currentRequest, status: 'Approved' as 'Approved' };
  //       this.vehicleRequestService.updateVehicleRequestRecord(requestId, updatedRequest).subscribe({
  //         next: () => {
  //           // Update Vehicle
  //           const updatedVehicle = { ...currentVehicle, status: 'On Trek' as 'On Trek', currentDriverId: driverId };
  //           this.vehicleService.updateVehicleRecord(vehicleId, updatedVehicle).subscribe({
  //             next: () => {
  //               // Update Driver
  //               const updatedDriver = { ...currentDriver, status: 'On Trek' as 'On Trek', assignedVehicleId: vehicleId };
  //               this.driverService.updateDriverRecord(driverId, updatedDriver).subscribe({
  //                 next: () => {
  //                   this.toastr.success('Vehicle allocated successfully');
  //                   // Reload data or redirect as needed
  //                 },
  //                 error: (error) => this.toastr.error('Error updating driver')
  //               });
  //             },
  //             error: (error) => this.toastr.error('Error updating vehicle')
  //           });
  //         },
  //         error: (error) => this.toastr.error('Error updating vehicle request')
  //       });
  //     } else {
  //       this.toastr.error('Selected entities do not exist');
  //     }
  //   } else {
  //     this.toastr.error('Form is not valid', 'Error');
  //   }
  // }

  ngOnInit(){
    
  }


}
