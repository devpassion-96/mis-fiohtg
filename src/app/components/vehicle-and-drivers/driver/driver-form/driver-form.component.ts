import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent implements OnInit {
//   driverForm: FormGroup;
//   isUpdateMode: boolean = false;
//   currentDriverId?: number;

//   employees: Employee[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private driverService: DriverService,
//     private employeeService: EmployeeService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.driverForm = this.fb.group({
//       staffId: ['', Validators.required],
//       status: ['', Validators.required],
//       returnDate: [''],
//       licenseNumber: ['', Validators.required],
//       assignedVehicleId: [''],
//       specialQualifications: this.fb.array([])
//       // trekHistory is not included as it's typically not editable in a form
//     });

//     this.loadEmployees();

//     // Check if it's an update operation
//     const driverId = this.route.snapshot.paramMap.get('id');
//     if (driverId) {
//       this.isUpdateMode = true;
//       this.currentDriverId = +driverId;
//       this.loadDriverData(this.currentDriverId);
//     }
//   }

//   loadDriverData(driverId: number) {
//     this.driverService.getDriverById(driverId.toString()).subscribe({
//       next: (driver) => {
//         this.driverForm.patchValue(driver);
//         // Additional logic to handle trekHistory and specialQualifications
//       },
//       error: () => console.error('Error fetching driver data')
//     });
//   }

//   loadEmployees() {
//     this.employeeService.getAllEmployees().subscribe({
//       next: (data) => {
//         this.employees = data;
//       },
//       error: () => console.error('Error fetching employees')
//     });
//   }

//   onSubmit() {
//     if (this.driverForm.valid) {
//       const driverData: Driver = this.driverForm.value;
//       if (this.isUpdateMode) {
//         // Update logic
//         this.driverService.updateDriverRecord(this.currentDriverId!.toString(), driverData).subscribe({
//           next: () => this.router.navigate(['/driver-list']),
//           error: () => console.error('Error updating driver')
//         });
//       } else {
//         // Create logic
//         this.driverService.addDriverRecord(driverData).subscribe({
//           next: () => this.router.navigate(['/driver-list']),
//           error: () => console.error('Error adding driver')
//         });
//       }
//     }
//   }

// get specialQualifications() {
//   return this.driverForm.get('specialQualifications') as FormArray;
// }

// addQualification() {
//   this.specialQualifications.push(this.fb.control(''));
// }

// removeQualification(index: number) {
//   this.specialQualifications.removeAt(index);
// }

ngOnInit() {
  
}

}
