export interface PerformanceReview {
  _id: string;
  staffId: string;
  reviewDate: Date;
  evaluator: string;
  performanceRating: number;
  comments: string;
  goals: Goal[];
}

interface Goal {
  description: string;
  status: string;
}
