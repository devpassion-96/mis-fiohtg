export interface Leave {
  _id: string;
  staffId: string; // loggen id staff
  handingOverTo: string;
  startDate: Date;
  endDate: Date;
  type: string; // Such as Annual, Sick, Casual, etc.
  remarks:string
  status: string;//'Pending' | 'HRReview' | 'FinanceReview' | 'Reviewed' | 'Approved' | 'Rejected'; // Such as Pending, Approved, Rejected
  comments?: Comment[];
  reviewedAt?: Date;
  approverComments:string;
  appliedOn: Date; // The date when leave was applied
  approvedBy?: string; // The ID of the approver
  approvedOn?: Date; // The date when leave was approved/rejected

}

export interface Comment {
  text: string;
  reviewedBy: string;
  reviewedAt: Date;
}


export interface ExtendedLeave extends Leave {
  employeeName?: string;
}
