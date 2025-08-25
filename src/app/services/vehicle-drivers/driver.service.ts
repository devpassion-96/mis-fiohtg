import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Driver, TrekRecord } from 'src/app/models/vehicle-drivers/driver.model';
import { environment } from 'src/environments/environment';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  // private readonly apiUrl = 'http://localhost:3000/drivers';
  private readonly apiUrl = `${environment.apiUrl}/drivers`;


 

  constructor(private http: HttpClient) {}

  // Get all drivers
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // Get a single driver by ID
  getDriver(id: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  // Create a new driver
  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  // Update an existing driver
  updateDriver(driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${driver._id}`, driver);
  }

  // Delete a driver
  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
