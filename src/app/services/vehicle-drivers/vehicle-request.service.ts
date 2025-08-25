import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleRequest } from 'src/app/models/vehicle-drivers/vehicle-request.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleRequestService {
  getRequestById(id: string) {
    throw new Error('Method not implemented.');
  }
  // private readonly apiUrl = 'http://localhost:3000/vehicle-requests';
  private readonly apiUrl = `${environment.apiUrl}/vehicle-requests`;


  constructor(private http: HttpClient) {}

  // Get all requests
  getRequests(): Observable<VehicleRequest[]> {
    return this.http.get<VehicleRequest[]>(this.apiUrl);
  }

  // Get a single request by ID
  getRequest(id: string): Observable<VehicleRequest> {
    return this.http.get<VehicleRequest>(`${this.apiUrl}/${id}`);
  }


  // Create a new request
  createRequest(request: VehicleRequest): Observable<VehicleRequest> {
    return this.http.post<VehicleRequest>(this.apiUrl, request);
  }

  // Update an existing request
  updateRequest(request: VehicleRequest): Observable<VehicleRequest> {
    return this.http.put<VehicleRequest>(`${this.apiUrl}/${request._id}`, request);
  }

  // Delete a request
  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
