export interface Task {
  id: number;
  projectId: number; // Link to Project ID
  assignedTo: string; // Staff ID
  assignedBy: string; // Staff ID
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt: Date;
}
