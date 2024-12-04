import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from 'src/app/models/m-and-e/report.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  private readonly apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }

  getReportById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report);
  }

  updateReport(id: string, report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
