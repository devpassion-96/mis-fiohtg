import { Designation } from "./designation.model";

export class Department {
  _id: string;
  name: string;
  designations: Designation[];
}

export { Designation };

