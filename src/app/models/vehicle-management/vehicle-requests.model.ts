export interface VehicleRequests {
    _id?: string;
    officerId: string;
    vehicleTypeRequested: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    allocationStatus: 'unallocated' | 'allocated';
    requestedDate?: Date;
  }
  