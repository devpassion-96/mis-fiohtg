// src/app/models/vehicle-drivers/allocation-view.model.ts
export interface AllocationView {
  _id?: string;
  requestId?: string;
  driverId?: string;
  vehicleId?: string;
  driverName: string;
  vehicleNumber: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
