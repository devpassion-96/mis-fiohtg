export interface Driver {
    _id?: string;
    name: string;
    status: 'in_office' | 'on_trek';
    returnDate?: Date;
  }
  