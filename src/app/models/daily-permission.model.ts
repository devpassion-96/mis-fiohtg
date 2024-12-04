export interface DailyPermission {
  _id: string;
  staffId: string;
  date: Date;
  reason: string;
  timeFrom: Date;
  timeTo: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  supervisorComments?: string;
  approvedBy?: string; // The ID of the approver
  approvedOn?: Date; // The date when leave was approved/rejected
}
