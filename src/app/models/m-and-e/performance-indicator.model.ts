export interface PerformanceIndicator {
  _id: string;
  projectName: string;
  // status: 'Attained' | 'Not Attained';
  verifiableIndicators: VerifiableIndicator[];
}

export interface VerifiableIndicator {
  id: number;
  level: 'Impact' | 'Outcome' | 'Output';
  interventionLogic: string;
  indicator: string;
  baseline: number | string;
  meansOfVerification: string;
  targetData: TargetData[];
}

export interface TargetData {
  id: number;
  period: string;
  targetFemale: number;
  targetMale: number;
  achievedFemale: number;
  achievedMale: number;
  varianceFemale: number;
  varianceMale: number;
  // cumulativeAchieved: number;
  // cumulativeTarget: number;
  // cumulativeVariance: number;
}
