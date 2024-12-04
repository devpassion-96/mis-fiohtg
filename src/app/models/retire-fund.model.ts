export interface RetireFund {
  _id:string;
  projectId: string;
  amount: number;
  staffId: string;
  date: Date;
  documents?: string[];
}
