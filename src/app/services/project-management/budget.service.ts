import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from 'src/app/models/project-management/budget.model';
import { environment } from 'src/environments/environment';

type TransferPayload = {
  sourceBudgetId: string;
  targetBudgetId: string;
  amount: number;
  description: string;
  createdByStaffId: string;     // NEW: logged-in staff id (required by backend)
  createdByName?: string;       // NEW: optional display name
};

type CashFlowPayload = {
  projectId: string;
  amount: number;
  description: string;
  createdByStaffId: string;     // NEW: logged-in staff id (required by backend)
  createdByName?: string;       // NEW: optional display name
};

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly apiUrl = `${environment.apiUrl}/budget`;

  constructor(private http: HttpClient) {}

  getAllBudgetRecords(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  getBudgetByProjectId(projectId: string): Observable<Budget[]> {
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get<Budget[]>(this.apiUrl, { params });
  }

  addBudgetRecord(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  updateBudgetRecord(id: string, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  deleteBudgetRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---------- UPDATED METHODS (now include creator info) ----------

  transferFunds(payload: TransferPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, payload);
  }

  addIncomingCashFlow(payload: CashFlowPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-funds`, payload);
  }

  // ---------------------------------------------------------------

  getTransactionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  getBudgetSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }
}
