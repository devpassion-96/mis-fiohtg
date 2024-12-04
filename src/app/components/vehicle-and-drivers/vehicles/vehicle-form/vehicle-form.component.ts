import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  // vehicleForm: FormGroup;
  // drivers: Employee[] = [];
  // isUpdateMode: boolean = false;
  // currentVehicleId?: number;

  // constructor(
  //   private fb: FormBuilder,
  //   private vehicleService: VehicleService,
  //   private employeeService: EmployeeService,
  //   private route: ActivatedRoute,
  //   private router: Router
  // ) {}

  // ngOnInit() {
  //   this.vehicleForm = this.fb.group({
  //     make: ['', Validators.required],
  //     model: ['', Validators.required],
  //     year: ['', Validators.required],
  //     licensePlate: ['', Validators.required],
  //     status: ['Available', Validators.required],
  //     currentDriverId: [''],
  //     breakdownStatus: [false]
  //   });

  //   this.loadDrivers();

  //   const vehicleId = this.route.snapshot.paramMap.get('id');
  //   if (vehicleId) {
  //     this.isUpdateMode = true;
  //     this.currentVehicleId = +vehicleId;
  //     this.loadVehicleData(this.currentVehicleId);
  //   }
  // }

  // loadDrivers() {
  //   this.employeeService.getAllEmployees().subscribe({
  //     next: (data) => {
  //       // this.drivers = data.filter(employee => employee.designation === 'Driver');
  //       this.drivers = data;
  //     },
  //     error: () => console.error('Error fetching drivers')
  //   });
  // }

  // loadVehicleData(vehicleId: number) {
  //   this.vehicleService.getVehicleById(vehicleId.toString()).subscribe({
  //     next: (vehicle) => this.vehicleForm.patchValue(vehicle),
  //     error: () => console.error('Error fetching vehicle data')
  //   });
  // }

  // onSubmit() {
  //   if (this.vehicleForm.valid) {
  //     const vehicleData: Vehicle = this.vehicleForm.value;
  //     if (this.isUpdateMode) {
  //       this.vehicleService.updateVehicleRecord(this.currentVehicleId!.toString(), vehicleData).subscribe({
  //         next: () => this.router.navigate(['/vehicle-list']),
  //         error: () => console.error('Error updating vehicle')
  //       });
  //     } else {
  //       this.vehicleService.addVehicleRecord(vehicleData).subscribe({
  //         next: () => this.router.navigate(['/vehicle-list']),
  //         error: () => console.error('Error adding vehicle')
  //       });
  //     }
  //   }
  // }

  ngOnInit(){
    
  }
}
