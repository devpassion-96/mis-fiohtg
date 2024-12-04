export interface Beneficiaries {
    male: number;
    female: number;
    pwds: number;
  }

  export interface OAPBeneficiaries {
    oap_male: number;
    oap_female: number;
    oap_pwds: number;
  }
  
  export interface WorkshopReport {
    activityTitle: string;
    community: string;
    facilitator: string;
    date: Date;
    beneficiaries: Beneficiaries;   
    budget: number;
    followUp: string;
    projectOrDonor: string;
  }

  export interface OtherActivityPlans {
    oap_activityTitle: string;
    oap_community: string;
    oap_facilitator: string;
    oap_date: Date;
    oap_beneficiaries: OAPBeneficiaries;   
    oap_budget: number;
    oap_followUp: string;
    oap_projectOrDonor: string;
  }

  
  export interface Report {
    _id?: string;
    month: string; // y
    officeActivities: string; // y
    govNgoMeetings: string; // y
    workshopReports: WorkshopReport[]; // y
    officeActivityPlans: string; // y
    otherActivityPlans: OtherActivityPlans[]; //
  }
  