import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityReport } from 'src/app/models/activity-report.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {
  // private readonly apiUrl = 'http://localhost:3000/activity-reports';
  private readonly apiUrl = `${environment.apiUrl}/activity-reports`;

  constructor(private http: HttpClient) {}

  addReport(report: ActivityReport): Observable<ActivityReport> {
    return this.http.post<any>(this.apiUrl, report);
  }

  getReportById(id: string): Observable<ActivityReport> {
    return this.http.get<ActivityReport>(`${this.apiUrl}/${id}`);
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // updateReport(report: ActivityReport): Observable<ActivityReport> {
  //   const url = `${this.apiUrl}/${report.id}`;
  //   return this.http.put<ActivityReport>(url, report);
  // }

  updateReport(id: string, permission: ActivityReport): Observable<ActivityReport> {
    return this.http.put<ActivityReport>(`${this.apiUrl}/${id}`, permission);
  }

  deleteReport(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

}

