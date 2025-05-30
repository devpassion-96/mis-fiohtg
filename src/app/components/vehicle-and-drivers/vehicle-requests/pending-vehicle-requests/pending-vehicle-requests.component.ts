import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Allocation } from 'src/app/models/vehicle-drivers/allocation.model';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { VehicleRequest } from 'src/app/models/vehicle-drivers/vehicle-request.model';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { AllocationService } from 'src/app/services/vehicle-drivers/allocation.service';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';
import { VehicleRequestService } from 'src/app/services/vehicle-drivers/vehicle-request.service';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-pending-vehicle-requests',
  templateUrl: './pending-vehicle-requests.component.html',
  styleUrls: ['./pending-vehicle-requests.component.css']
})
export class PendingVehicleRequestsComponent {

 
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
 
   userRole: string; // Admin, Manager, or Employee
 userDepartment: string; // For managers
 userStaffId: string; // For employees

 itemsPerPage: number = 10;
  p: number = 1;
 
   constructor(private requestService: VehicleRequestService, private vehicleService: VehicleService,
     private driverService: DriverService, private router: Router,private employeeService: EmployeeService,
     private allocationService: AllocationService,private authService: AuthService) {}
 
   ngOnInit(): void {
     this.loadRequests();
     this.loadDrivers();
     this.loadVehicles();
     this.loadAllocations();
     this.loadUserRole();
   }
 
   loadUserRole(): void {
     const userData = this.authService.getCurrentUserData();
     if (userData) {
       this.userRole = userData.role;
       this.userDepartment = userData.department; // Only for managers
       this.userStaffId = userData.staffId; // Only for employees
     } else {
       this.userRole = 'employee'; // Default to employee if no user data is found
     }
   }
 
  //  loadRequests(): void {
  //    this.requestService.getRequests().subscribe(data => {
  //      this.requests = data.filter(request => request.status === 'Pending');
  //    });
  //  }

   loadRequests(): void {
       forkJoin({
         requests: this.requestService.getRequests(),
         employees: this.employeeService.getAllEmployees()
       }).pipe(
         map(({ requests, employees }) => {
           return requests.map(request => ({
             ...request,
             employeeName: employees.find(emp => emp.staffId === request.requestingOfficer)?.firstName + ' ' +
                           employees.find(emp => emp.staffId === request.requestingOfficer)?.lastName || 'Unknown'
           }));
         })
       ).subscribe({
         next: (enrichedRequests) => {
           this.requests = enrichedRequests.filter(request => request.status === 'Pending');;
         },
         error: (error) => {
           console.error('Error loading requests or employees:', error);
         }
       });
     }
 
   // loadRequests(): void {
   //   forkJoin({
   //     requests: this.requestService.getRequests(),
   //     drivers: this.driverService.getDrivers(),
   //     vehicles: this.vehicleService.getVehicles(),
   //     allocations: this.allocationService.getAllocations()
   //   })
   //     .pipe(
   //       map(({ requests, drivers, vehicles, allocations }) => {
   //         // Enrich requests with driver, vehicle, and allocation details
   //         const enrichedRequests = requests.map(request => {
   //           const allocation = allocations.find(a => a.requestId === request._id);
   //           const driver = allocation ? drivers.find(d => d._id === allocation.driverId) : null;
   //           const vehicle = allocation ? vehicles.find(v => v._id === allocation.vehicleId) : null;
   
   //           return {
   //             ...request,
   //             driverName: driver ? `${driver.name}` : 'Unassigned',
   //             vehicleName: vehicle ? vehicle.vehicleNumber : 'Unassigned',
   //             allocationStatus: allocation ? (allocation.completed ? 'Completed' : 'Active') : 'Pending'
   //           };
   //         });
   
   //         // Apply role-based filtering
   //         if (this.userRole === 'admin') {
   //           return enrichedRequests; // Admin sees all requests
   //         } else if (this.userRole === 'manager') {
   //           return enrichedRequests.filter(request => request.unit === this.userDepartment); // Manager sees only their department's requests
   //         } else if (this.userRole === 'employee') {
   //           return enrichedRequests.filter(request => request.requestingOfficer === this.userStaffId); // Employee sees only their own requests
   //         }
   
   //         return []; // Default to an empty list if no role matches
   //       })
   //     )
   //     .subscribe({
   //       next: (filteredRequests) => {
   //         this.requests = filteredRequests; // Store filtered/enriched requests
   //       },
   //       error: (error) => {
   //         console.error('Failed to load requests:', error); // Log error
   //       }
   //     });
   // }
   
 
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
