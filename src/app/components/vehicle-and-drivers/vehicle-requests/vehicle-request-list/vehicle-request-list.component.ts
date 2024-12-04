import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Allocation } from 'src/app/models/vehicle-drivers/allocation.model';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { VehicleRequest } from 'src/app/models/vehicle-drivers/vehicle-request.model';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { AllocationService } from 'src/app/services/vehicle-drivers/allocation.service';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-vehicle-request-list',
  templateUrl: './vehicle-request-list.component.html',
  styleUrls: ['./vehicle-request-list.component.css']
})
export class VehicleRequestListComponent implements OnInit {

  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  requests: VehicleRequest[] = [];
  allocations: Allocation[] = [];  // Keep track of allocations

  newRequest: VehicleRequest = {
    requestingOfficer: 'Modou Jallow',
    unit: 'Manager',
    purpose: 'Research',
    projectGoalNumber: 'AJS34UY',
    travelingDay: '2024-10-27',
    returnDay: '2024-11-27',
    cumulativeDays: 12,
    regions: 'CRR',
    district: 'Badibu',
    villages: 'Bondali',
    remarks: 'Remarks',
    status: 'Pending'
  };
  isEditing = false;
  requestToEdit?: VehicleRequest;

  constructor(private requestService: VehicleRequestService, private vehicleService: VehicleService,
    private driverService: DriverService, private router: Router,
    private allocationService: AllocationService) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadDrivers();
    this.loadVehicles();
    this.loadAllocations();
  }

  loadRequests(): void {
    this.requestService.getRequests().subscribe(data => {
      this.requests = data;
    });
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe(data => {
      this.drivers = data;
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(data => {
      this.vehicles = data;
    });
  }

  loadAllocations(): void {
    this.allocationService.getAllocations().subscribe(data => {
      this.allocations = data;
      console.log("here are all the allocations: ",data)
    });
  }

  // approveAndAllocate(request: VehicleRequest): void {
  //   // Check for the first available driver and vehicle before approving
  //   const availableDriver = this.drivers.find(driver => driver.status === 'Available');
  //   const availableVehicle = this.vehicles.find(vehicle => vehicle.status === 'Available');
  
  //   if (availableDriver && availableVehicle) {
  //     // Only approve the request if both resources are available
  //     request.status = 'Approved';
  //     this.requestService.updateRequest(request).subscribe(() => {
  //       // Proceed with allocation since both driver and vehicle are available
  //       this.allocateDriverAndVehicle(request, availableDriver, availableVehicle);
  //     });
  //   } else {
  //     alert('No available driver or vehicle for allocation.');
  //   }
  // }

  approveAndAllocate(request: VehicleRequest): void {
    // Find the first available driver, prioritizing by return date
    const availableDriver = this.drivers
      .filter(driver => driver.status === 'Available')
      .sort((a, b) => {
        const dateA = a.returnDate ? new Date(a.returnDate).getTime() : -Infinity;
        const dateB = b.returnDate ? new Date(b.returnDate).getTime() : -Infinity;
        return dateA - dateB;
      })[0];
  
    // Find the first available vehicle, prioritizing by return date
    const availableVehicle = this.vehicles
      .filter(vehicle => vehicle.status === 'Available')
      .sort((a, b) => {
        const dateA = a.returnDate ? new Date(a.returnDate).getTime() : -Infinity;
        const dateB = b.returnDate ? new Date(b.returnDate).getTime() : -Infinity;
        return dateA - dateB;
      })[0];
  
    if (availableDriver && availableVehicle) {
      // Only approve the request if both resources are available
      request.status = 'Approved';
      this.requestService.updateRequest(request).subscribe(() => {
        // Proceed with allocation since both driver and vehicle are available
        this.allocateDriverAndVehicle(request, availableDriver, availableVehicle);
      });
    } else {
      alert('No available driver or vehicle for allocation.');
    }
  }
  
  
  allocateDriverAndVehicle(request: VehicleRequest, driver: Driver, vehicle: Vehicle): void {
    // Construct the allocation based on available driver and vehicle
    const allocation: Allocation = {
      requestId: request._id!,
      driverId: driver._id!,
      vehicleId: vehicle._id!,
      startDate: request.travelingDay,
      endDate: request.returnDay
    };
  
    // Create the allocation record
    this.allocationService.createAllocation(allocation).subscribe(() => {
      // Update driver and vehicle statuses to "On Trek"
      driver.status = 'On Trek';
      this.driverService.updateDriver(driver).subscribe(() => {
        this.loadDrivers();  // Reload drivers after status change
      });
  
      vehicle.status = 'On Trek';
      this.vehicleService.updateVehicle(vehicle).subscribe(() => {
        this.loadVehicles(); // Reload vehicles after status change
      });
    });
  }
  
  // Method to handle return from trek
  // returnFromTrek(request: VehicleRequest): void {
  //   const allocation = this.allocations.find(a => a.requestId === request.id);
  
  //   if (allocation) {
  //     // Retrieve the driver by ID to get a complete object, then update its status
  //     const driver = this.drivers.find(d => d.id === allocation.driverId);
  //     if (driver) {
  //       this.driverService.updateDriver({ ...driver, status: 'Available', returnDate: null }).subscribe(() => {
  //         this.loadDrivers();  // Reload drivers after status change
  //       });
  //     }
  
  //     // Retrieve the vehicle by ID to get a complete object, then update its status
  //     const vehicle = this.vehicles.find(v => v.id === allocation.vehicleId);
  //     if (vehicle) {
  //       this.vehicleService.updateVehicle({ ...vehicle, status: 'Available' }).subscribe(() => {
  //         this.loadVehicles(); // Reload vehicles after status change
  //       });
  //     }
  
  //     // Update request status to "Completed"
  //     request.status = 'Completed' as 'Pending' | 'Approved' | 'Rejected' | 'Completed';  // Type assertion to allow "Completed"
  //     this.requestService.updateRequest(request).subscribe(() => {
  //       this.loadRequests(); // Reload requests to reflect the change
  //     });
  //   }
  // }

  // Method to handle return from trek
// returnFromTrek(request: VehicleRequest): void {

  
//   const allocation = this.allocations.find(a => a.requestId.toISOString() == request._id);

//   if (allocation) {
//     // Retrieve the driver by ID to get a complete object, then update its status and clear return date
//     const driver = this.drivers.find(d => d._id === allocation.driverId);
//     if (driver) {
//       this.driverService.updateDriver({ ...driver, status: 'Available', returnDate: new Date().toISOString() }).subscribe(() => {
//         this.loadDrivers();  // Reload drivers after status change
//       });
//     }

//     // Retrieve the vehicle by ID to get a complete object, then update its status and clear return date
//     const vehicle = this.vehicles.find(v => v._id === allocation.vehicleId);
//     if (vehicle) {
//       this.vehicleService.updateVehicle({ ...vehicle, status: 'Available', returnDate: new Date().toISOString() }).subscribe(() => {
//         this.loadVehicles(); // Reload vehicles after status change
//       });
//     }

//     // Update request status to "Completed"
//     request.status = 'Completed' as 'Pending' | 'Approved' | 'Rejected' | 'Completed';  // Type assertion to allow "Completed"
//     this.requestService.updateRequest(request).subscribe(() => {
//       this.loadRequests(); // Reload requests to reflect the change
//     });
//   }
// }

// returnFromTrek(request: VehicleRequest): void {
//   // Log all allocations to check the data
//   console.log("All Allocations: ", this.allocations);

//   // Log the request ID for debugging
//   console.log("Request ID: ", request._id);

//   // Find the allocation for the specific request
//   const allocation = this.allocations.find((a) => {
//     console.log("Checking Allocation: ", a); // Log each allocation being checked
//     return a.requestId.toString() === request._id.toString();
//   });

//   if (!allocation) {
//     console.error('Allocation not found for the request.');
//     return;
//   }

//   console.log("Found Allocation: ", allocation); // Log the found allocation

//   // Update the driver
//   const driver = this.drivers.find((d) => d._id === allocation.driverId);
//   if (driver) {
//     const updatedDriver = { ...driver, status: 'Available' as 'Available', returnDate: null };
//     this.driverService.updateDriver(updatedDriver).subscribe(
//       () => {
//         console.log('Driver status updated successfully.');
//         this.loadDrivers(); // Reload drivers to reflect changes
//       },
//       (error) => {
//         console.error('Failed to update driver status:', error);
//       }
//     );
//   }

//   // Update the vehicle
//   const vehicle = this.vehicles.find((v) => v._id === allocation.vehicleId);
//   if (vehicle) {
//     const updatedVehicle = { ...vehicle, status: 'Available' as 'Available', returnDate: null };
//     this.vehicleService.updateVehicle(updatedVehicle).subscribe(
//       () => {
//         console.log('Vehicle status updated successfully.');
//         this.loadVehicles(); // Reload vehicles to reflect changes
//       },
//       (error) => {
//         console.error('Failed to update vehicle status:', error);
//       }
//     );
//   }

//   // Mark the request as completed
//   request.status = 'Completed' as 'Pending' | 'Approved' | 'Rejected' | 'Completed';
//   this.requestService.updateRequest(request).subscribe(
//     () => {
//       console.log('Request status updated successfully.');
//       this.loadRequests(); // Reload requests to reflect changes
//     },
//     (error) => {
//       console.error('Failed to update request status:', error);
//     }
//   );
// }

returnFromTrek(request: VehicleRequest): void {
  const allocation = this.allocations.find(a => a.requestId === request._id);
  if (allocation) {
    // Retrieve the driver by ID to get a complete object, then update its status and clear return date
    const driver = this.drivers.find(d => d._id === allocation.driverId);
    if (driver) {
      this.driverService.updateDriver({ ...driver, status: 'Available', returnDate: new Date().toISOString() }).subscribe(() => {
        this.loadDrivers();  // Reload drivers after status change
      });
    }
    // Retrieve the vehicle by ID to get a complete object, then update its status and clear return date
    const vehicle = this.vehicles.find(v => v._id === allocation.vehicleId);
    if (vehicle) {
      this.vehicleService.updateVehicle({ ...vehicle, status: 'Available', returnDate: new Date().toISOString() }).subscribe(() => {
        this.loadVehicles(); // Reload vehicles after status change
      });
    }
    // Update request status to "Completed"
    request.status = 'Completed' as 'Pending' | 'Approved' | 'Rejected' | 'Completed';  // Type assertion to allow "Completed"
    this.requestService.updateRequest(request).subscribe(() => {
      this.loadRequests(); // Reload requests to reflect the change
    });
  }
}


  
  activeAllocations(): Allocation[] {
    return this.allocations.filter(a => !a.completed);
  }
  
  completedAllocations(): Allocation[] {
    return this.allocations.filter(a => a.completed);
  }
  
  
  

  addRequest(): void {
    this.requestService.createRequest(this.newRequest).subscribe(request => {
      this.requests.push(request);
      this.newRequest = { ...this.newRequest, status: 'Pending' };  // Reset form with default status
    });
  }

  // editRequest(request: VehicleRequest): void {
  //   this.isEditing = true;
  //   this.requestToEdit = { ...request };
  // }

  editRequest(request: VehicleRequest): void {
    this.isEditing = true;
    this.router.navigate(['/vehicle-request-form', request._id]); // Navigate to form with ID
  }

  updateRequest(): void {
    if (this.requestToEdit) {
      this.requestService.updateRequest(this.requestToEdit).subscribe(updatedRequest => {
        const index = this.requests.findIndex(r => r._id === updatedRequest._id);
        if (index > -1) {
          this.requests[index] = updatedRequest;
        }
        this.isEditing = false;
        this.requestToEdit = undefined;
      });
    }
  }

  deleteRequest(id: string): void {
    this.requestService.deleteRequest(id).subscribe(() => {
      this.requests = this.requests.filter(r => r._id !== id);
    });
  }

  approveRequest(request: VehicleRequest): void {
    request.status = 'Approved';
    this.requestService.updateRequest(request).subscribe(updatedRequest => {
      const index = this.requests.findIndex(r => r._id === updatedRequest._id);
      if (index > -1) {
        this.requests[index] = updatedRequest;
      }
    });
  }

  rejectRequest(request: VehicleRequest): void {
    request.status = 'Rejected';
    this.requestService.updateRequest(request).subscribe(updatedRequest => {
      const index = this.requests.findIndex(r => r._id === updatedRequest._id);
      if (index > -1) {
        this.requests[index] = updatedRequest;
      }
    });
  }

  
}