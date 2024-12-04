import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetireFund } from 'src/app/models/retire-fund.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RetireFundService {
  private readonly apiUrl = `${environment.apiUrl}/retired-funds`;

  constructor(private http: HttpClient) {}

  getAllRetireFundRecords(): Observable<RetireFund[]> {
    return this.http.get<RetireFund[]>(this.apiUrl);
  }

  getRetireFundById(id: string): Observable<RetireFund> {
    return this.http.get<RetireFund>(`${this.apiUrl}/${id}`);
  }

  // addRetireFundRecord(retireFund: RetireFund): Observable<RetireFund> {
  //   return this.http.post<RetireFund>(this.apiUrl, retireFund);
  // }

  // Changed to accept FormData for file uploads
  addRetireFundRecord(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRetireFundRecord(id: string, retireFund: RetireFund): Observable<RetireFund> {
    return this.http.put<RetireFund>(`${this.apiUrl}/${id}`, retireFund);
  }

  deleteRetireFundRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
