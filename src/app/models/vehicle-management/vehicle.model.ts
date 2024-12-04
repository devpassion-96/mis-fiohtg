export interface Vehicle {
    _id?: string;
    plateNumber: string;
    status: 'available' | 'in_use' | 'under_repair';
    location?: string;
    lastServiceDate?: Date;
  }
  