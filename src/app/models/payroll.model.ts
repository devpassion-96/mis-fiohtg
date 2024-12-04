export interface Payroll {
  id: string;
  staffId: string;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
}



// export interface Payroll {
//   id: string;
//   staffId: string;
//   payPeriod: PayPeriod;
//   grossPay: number;
//   netPay: number;
//   deductions: Deduction[];
//   bonuses: Bonus[];
// }

// interface PayPeriod {
//   start: Date;
//   end: Date;
// }

// interface Deduction {
//   type: string;
//   amount: number;
// }

// interface Bonus {
//   type: string;
//   amount: number;
// }
