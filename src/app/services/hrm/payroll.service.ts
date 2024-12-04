import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payroll } from 'src/app/models/payroll.model';

import { map, switchMap } from 'rxjs/operators';
import { EmployeeService } from './employee.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly apiUrl = `${environment.apiUrl}/payroll`;

  constructor(private http: HttpClient, private employeeService: EmployeeService) {}

  getAllPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.apiUrl);
  }

  getPayrollById(id: string): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.apiUrl}/${id}`);
  }

  addPayroll(payroll: Payroll): Observable<Payroll> {
    return this.http.post<Payroll>(this.apiUrl, payroll);
  }

  updatePayroll(id: string, payroll: Payroll): Observable<Payroll> {
    return this.http.put<Payroll>(`${this.apiUrl}/${id}`, payroll);
  }

  deletePayroll(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  fetchEmployeePayrollData(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
      switchMap(employees => {
        return this.getAllPayrolls().pipe(
          map(payrolls => payrolls.map(payroll => {
            const employee = employees.find(emp => emp.staffId === payroll.staffId);
            return { ...payroll, employee };
          }))
        );
      })
    );
  }

  calculateNetSalary(payroll: any) {
    const { basicSalary, bonuses, deductions } = payroll;
    return basicSalary + bonuses - deductions;
  }

  addAdjustment(adjustmentData: any): Observable<any> {
    // Logic to find the payroll entry and update it...
    // For example:
    return this.getPayrollById(adjustmentData.staffId).pipe(
      switchMap(payroll => {
        const updatedPayroll = {
          ...payroll,
          bonuses: adjustmentData.bonuses,
          deductions: adjustmentData.deductions,
          netSalary: this.calculateNetSalary({
            ...payroll,
            bonuses: adjustmentData.bonuses,
            deductions: adjustmentData.deductions
          })
        };
        return this.updatePayroll(payroll.id, updatedPayroll);
      })
    );
  }
}
