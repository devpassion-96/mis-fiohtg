import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from 'src/app/models/request.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getAllRequestRecords(): Observable<Request[]> {
    return this.http.get<Request[]>(this.apiUrl);
  }

  getRequestById(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.apiUrl}/${id}`);
  }

  addRequestRecord(Request: Request): Observable<Request> {
    return this.http.post<Request>(this.apiUrl, Request);
  }

  updateRequestRecord(id: string, Request: Request): Observable<Request> {
    return this.http.put<Request>(`${this.apiUrl}/${id}`, Request);
  }

  deleteRequestRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
