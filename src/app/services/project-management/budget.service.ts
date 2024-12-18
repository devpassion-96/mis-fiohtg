import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from 'src/app/models/project-management/budget.model';
import { environment } from 'src/environments/environment';

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
    // return this.http.get<Budget[]>(`${this.apiUrl}?projectId=${projectId}`);

    const params = new HttpParams().set('projectId', projectId); // Clean and safe query parameter handling
    return this.http.get<Budget[]>(this.apiUrl, { params });
  }


  addBudgetRecord(Budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, Budget);
  }

  updateBudgetRecord(id: string, Budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, Budget);
  }

  deleteBudgetRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
