export class ActivityReport {
  _id:string;
  reportFiledBy: string;
  dateOfFiling: Date;
  activityTitle: string;
  activityDate: Date;
  venue: string;
  organisers: string;
  targetParticipantsMales: number;
  targetParticipantsFemales: number;
  actualParticipantsMales: number;
  actualParticipantsFemales: number;
  facilitators: string;
  specificGoal: string;
  contribution: string;
  activityNature: string;
  inputsUsed: string;
  indicators: string;
  outputs: string;
  outcomes: string;
  findings: string;
  recommendations: string;
  additionalInfo: string;
  photos: File | null;

  constructor() {
    // Initialize all properties with default values
    this.reportFiledBy = '';
    this.dateOfFiling = new Date();
    // ... Initialize other properties similarly
    this.photos = null;
  }
}
