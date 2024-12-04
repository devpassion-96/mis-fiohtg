export interface Budget {
  _id: string;
  projectId: string;
  amount: number;
  balance: number;
  departmentId:string;
  createdBy: string;   //logged in user
}
