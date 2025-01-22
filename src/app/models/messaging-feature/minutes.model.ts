
export interface MeetingMinutes {
  _id: number;
  title: string;
  meetingDate: Date;
  pointsDiscussed: string[];
  decisionsMade: string[];
  actionItems: string[];
  createdBy: string;
  readBy: string[];
  participants: string[];
  nonStaffMembers: string[];
  absentWithApology: string[];
  agenda: string[];
  secretary: string; // Identifier of the secretary (e.g., name, email)
  secretarySignature: string; // Path or data URL of the secretary's electronic signature
  chairperson: string; // Identifier of the chairperson (e.g., name, email)
  chairpersonSignature: string; // Path or data URL of the chairperson's electronic signature
}
