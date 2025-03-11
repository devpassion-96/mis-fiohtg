export interface Request {
  _id: string;
  projectId: string;
  staffId: string;  //logged in staff
  amountRequested: number;
  description: string;
  status: 'Pending' | 'ManagerReview' | 'M&EReview' | 'Reviewed' | 'Approved' | 'Rejected';
  comments: Comment[];
  createdAt: Date;
  reviewedAt?: Date; //timestamp upon adding comment or upon review confirmation
  approvedOrRejectedAt?: Date; //timestamp
  approvedBy?: string; //director
  projectName?: string;
  employeeName?: string;
  reviewedBy?:string;
  files: string[];  // Array of file URLs or file names

  // attachment: File | null;
  outputs?: string;

  // New Payment Details (optional for Approved requests)
  paymentDetails?: PaymentDetails;
}


export interface Comment {
  text: string;
  reviewedBy: string;
  reviewedAt: Date;
}

export interface PaymentDetails {
  paymentMadeVia: 'Cash' | 'Check' | 'Bank Transfer';
  referenceNumber: string;
  processedBy: string;  // Finance Manager's ID or Name
  processedAt: Date;
}

