// import { Component } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Allocation } from 'src/app/models/vehicle-drivers/allocation.model';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { AllocationService } from 'src/app/services/vehicle-drivers/allocation.service';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';
import { VehicleService } from 'src/app/services/vehicle-drivers/vehicle.service';
import { AllocationView } from 'src/app/models/vehicle-drivers/allocation-view.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-allocation-list',
  templateUrl: './vehicle-allocation-list.component.html',
  styleUrls: ['./vehicle-allocation-list.component.css']
})
export class VehicleAllocationListComponent {

  loading = false;
  error: string | null = null;

  rows: AllocationView[] = [];

  itemsPerPage: number = 10;
  p: number = 1;

  constructor(
    private allocationService: AllocationService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
  this.loading = true;
  this.error = null;

  forkJoin({
    allocations: this.allocationService.getAllocations(),
    drivers: this.driverService.getDrivers(),
    vehicles: this.vehicleService.getVehicles()
  }).subscribe({
    next: ({ allocations, drivers, vehicles }) => {
      const driverMap = new Map<string, Driver>();
      const vehicleMap = new Map<string, Vehicle>();

      drivers.forEach(d => d?._id && driverMap.set(d._id, d));
      vehicles.forEach(v => v?._id && vehicleMap.set(v._id, v));

      this.rows = allocations
        .map(a => {
          const d = a.driverId ? driverMap.get(a.driverId) : undefined;
          const v = a.vehicleId ? vehicleMap.get(a.vehicleId) : undefined;

          return {
            _id: a._id,
            requestId: a.requestId,
            driverId: a.driverId,
            vehicleId: a.vehicleId,
            driverName: d?.name ?? '(driver not found)',
            vehicleNumber: v?.vehicleNumber ?? '(vehicle not found)',
            startDate: a.startDate ?? null,
            endDate: a.endDate ?? null,
            completed: a.completed,
            createdAt: (a as any)?.createdAt,
            updatedAt: (a as any)?.updatedAt
          } as AllocationView;
        })
        .sort((a, b) => {
          const da = new Date(a.createdAt ?? 0).getTime();
          const db = new Date(b.createdAt ?? 0).getTime();
          return db - da; // sort descending, newest first
        });

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load allocations.';
      this.loading = false;
    }
  });
}


  // Optional actions
markCompleted(row: AllocationView): void {
  if (!row._id) return;

  const payload: Allocation = {
    _id: row._id,
    requestId: row.requestId!,          // you can assert if you know it's set
    driverId: row.driverId ?? '',
    vehicleId: row.vehicleId ?? '',
    completed: true
  };

  if (row.startDate) payload.startDate = this.toIso(row.startDate);
  if (row.endDate)   payload.endDate   = this.toIso(row.endDate);

  this.allocationService.updateAllocation(payload).subscribe({
    next: () => { this.toastr.success('Allocation marked as completed'); this.loadData(); },
    error: (e) => { console.error(e); this.toastr.error('Could not update allocation'); }
  });
}

private toIso(input: string | Date): string {
  const d = new Date(input);
  return isNaN(d.getTime()) ? '' : d.toISOString(); // API typically accepts ISO
}


  delete(row: AllocationView): void {
    if (!row._id) return;
    if (!confirm('Delete this allocation?')) return;
    this.allocationService.deleteAllocation(row._id).subscribe({
      next: () => {
        this.toastr.success('Allocation deleted');
        this.rows = this.rows.filter(r => r._id !== row._id);
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Could not delete allocation');
      }
    });
  }

  formatDateForCell(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    // Display as YYYY-MM-DD to match your forms
    return d.toISOString().slice(0, 10);
  }

}
