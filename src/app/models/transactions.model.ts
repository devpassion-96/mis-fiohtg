export interface Transaction {
  _id?: string;
  type: 'transfer' | 'cashflow';
  sourceBudgetId?: string;
  targetBudgetId?: string;
  projectId?: string;      // for cashflow
  amount: number;
  description: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;

  // NEW: who performed it
  createdByStaffId?: string;
  createdByName?: string;

}

export interface TransactionView extends Transaction {
  sourceProjectName?: string;
  targetProjectName?: string;
  projectName?: string;    // for cashflow
  createdAtResolved?: string; // ISO for sorting/display
}
