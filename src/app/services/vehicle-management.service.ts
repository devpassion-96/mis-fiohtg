import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VehicleRequests } from '../models/vehicle-management/vehicle-requests.model';
import { Vehicle } from '../models/vehicle-management/vehicle.model';
import { Driver } from '../models/vehicle-management/driver.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleManagementService {

  // private apiUrl = 'http://localhost:5000/api';

  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Request APIs
  createRequest(request: VehicleRequests): Observable<VehicleRequests> {
    return this.http.post<VehicleRequests>(`${this.apiUrl}/vehicle-requests`, request);
  }

    // getRequests APIs
    getRequests(): Observable<VehicleRequests[]> {
      return this.http.get<VehicleRequests[]>(`${this.apiUrl}/vehicle-requests`);
    }

  approveRequest(id: string): Observable<VehicleRequests> {
    return this.http.put<VehicleRequests>(`${this.apiUrl}/vehicle-requests/${id}/approve`, {});
  }

  allocateVehicle(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vehicle-requests/${id}/allocate`, {});
  }

  // Vehicle APIs
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }

  // Driver APIs
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/drivers`);
  }
}
