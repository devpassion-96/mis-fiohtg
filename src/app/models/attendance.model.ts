export interface Attendance {
  id: string;
  staffId: string;
  date: Date;
  timeIn: Date;
  timeOut: Date;
  status: string; // 'Present', 'Absent', 'Late', 'Half-day', etc.
  remarks: string; // Optional notes or reasons
  // modifiedBy?: string; // ID of the user/admin who modified the record
}
