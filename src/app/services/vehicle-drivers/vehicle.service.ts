import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/models/vehicle-drivers/vehicle.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  // private readonly apiUrl = 'http://localhost:3000/vehicles';
  private readonly apiUrl = `${environment.apiUrl}/vehicles`;


  constructor(private http: HttpClient) {}

  // getAllVehicleRecords(): Observable<Vehicle[]> {
  //   return this.http.get<Vehicle[]>(this.apiUrl);
  // }

  // getVehicleById(id: string): Observable<Vehicle> {
  //   return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  // }

  // addVehicleRecord(vehicle: Vehicle): Observable<Vehicle> {
  //   return this.http.post<Vehicle>(this.apiUrl, vehicle);
  // }

  // updateVehicleRecord(id: string, vehicle: Vehicle): Observable<Vehicle> {
  //   return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  // }

  // deleteVehicleRecord(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }


  // Get all vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  // Get a single vehicle by ID
  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  // Create a new vehicle
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  // Update an existing vehicle
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${vehicle._id}`, vehicle);
  }

  // Delete a vehicle
  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
