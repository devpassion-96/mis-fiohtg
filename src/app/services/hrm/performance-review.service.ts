import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceReview } from 'src/app/models/performance-review.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PerformanceReviewService {
  private readonly apiUrl = `${environment.apiUrl}/performanceReviews`;

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(this.apiUrl);
  }

  getReviewById(id: string): Observable<PerformanceReview> {
    return this.http.get<PerformanceReview>(`${this.apiUrl}/${id}`);
  }

  addReview(review: PerformanceReview): Observable<PerformanceReview> {
    return this.http.post<PerformanceReview>(this.apiUrl, review);
  }

  updateReview(id: string, review: PerformanceReview): Observable<PerformanceReview> {
    return this.http.put<PerformanceReview>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
