export interface AllocationHistory {
  vehicleInfo: string; // Details about the vehicle
  driverInfo: string; // Details about the driver
  allocationStart: Date; // Start date of the allocation
  allocationEnd: Date; // End date of the allocation
  updatedAt?: string | Date;
}

