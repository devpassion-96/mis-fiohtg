export interface Employee {
  _id: any;
  staffId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  city: string;
  mobileNumber: string;
  email: string;
  remarks: string;
  appointmentDate: Date;
  designation: string;
  department: string;
  grade: number;
  point: number;
  nationalIdentificationNumber: number;
  tinNumber: number;
  sshfcNumber: number;
  staffType: string;
  staffStatus: string;
  basicSalary: number;
  probationEndDate: Date;
  image: string;
  dependents: Dependent[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Dependent {
  dependentFirstName: string;
  dependentLastName: string;
  dependentDOB: Date;
  dependentGender: string;
  dependentRelationship: string;
}
