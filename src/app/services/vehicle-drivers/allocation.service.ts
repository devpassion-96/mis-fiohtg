import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allocation } from 'src/app/models/vehicle-drivers/allocation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  // private apiUrl = 'http://localhost:3000/allocations';
  private readonly apiUrl = `${environment.apiUrl}/allocations`;


  constructor(private http: HttpClient) {}

  // Get all allocations
  getAllocations(): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(this.apiUrl);
  }

  // Create a new allocation
  createAllocation(allocation: Allocation): Observable<Allocation> {
    return this.http.post<Allocation>(this.apiUrl, allocation);
  }

  updateAllocation(allocation: Allocation): Observable<Allocation> {
    return this.http.put<Allocation>(`${this.apiUrl}/${allocation._id}`, allocation);
  }

  // src/app/services/allocation.service.ts
    deleteAllocation(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
