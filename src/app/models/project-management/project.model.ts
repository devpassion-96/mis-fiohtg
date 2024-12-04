export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  managerId: string; // Link to Staff ID
  teamMembers: string[]; // Array of Staff IDs
  comments: Comment[];
  activities: Activity[];
}

export interface Comment {
  content: string;
  staffId: string;
  timestamp: Date;
}

export interface Activity {
  description: string;
  startDate: Date;
  endDate: Date;
  responsiblePerson: string; // Could be a staff ID or name
  responsiblePersonName?: string;
}
