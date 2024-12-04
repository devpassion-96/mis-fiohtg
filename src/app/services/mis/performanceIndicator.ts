import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceIndicator } from 'src/app/models/m-and-e/performance-indicator.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceIndicatorService {

  // private apiUrl = 'http://localhost:3000/performanceIndicators';
  private readonly apiUrl = `${environment.apiUrl}/performance-indicators`;


  constructor(private http: HttpClient) { }

  // Fetch all performance indicators
  getAll(): Observable<PerformanceIndicator[]> {
    return this.http.get<PerformanceIndicator[]>(this.apiUrl);
  }

  // Get a single performance indicator by id
  getById(id: string): Observable<PerformanceIndicator> {
    return this.http.get<PerformanceIndicator>(`${this.apiUrl}/${id}`);
  }

  // Create a new performance indicator
  create(indicator: PerformanceIndicator): Observable<PerformanceIndicator> {
    return this.http.post<PerformanceIndicator>(this.apiUrl, indicator);
  }

  // Update an existing performance indicator
  // update(indicator: PerformanceIndicator): Observable<PerformanceIndicator> {
  //   return this.http.put<PerformanceIndicator>(`${this.apiUrl}/${indicator.id}`, indicator);
  // }

  // In PerformanceIndicatorService
update(id: string, data: any): Observable<any> {
  return this.http.put<PerformanceIndicator>(`${this.apiUrl}/${id}`, data);
}


  // Delete a performance indicator by id
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
