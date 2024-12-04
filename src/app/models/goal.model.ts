export interface TargetPeriod {
  periodType: string;
  periodValue: string;
  targets: {
    female: number;
    male: number;
    total: number;
  };
  achieved: {
    female: number;
    male: number;
    total: number;
  };
  variance?: {
    female: number;
    male: number;
    total: number;
  };
  status: 'Attained' | 'Not Attained';
}

export interface Indicator {
  description: string;
  baselineValue: string | number;
  isBaselineLocked: boolean;
  meansOfVerification: string;
  targetPeriods: TargetPeriod[];
}

export interface Objective {
  description: string;
  isLocked: boolean;
  indicators: Indicator[];
}

export interface Goal {
  id?: string; // This will be defined when we fetch from the backend
  level: 'Impact' | 'Outcome' | 'Output';
  objectives: Objective[];
}
