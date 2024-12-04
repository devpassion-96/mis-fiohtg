import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyPermission } from 'src/app/models/daily-permission.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DailyPermissionService {
  private readonly apiUrl = `${environment.apiUrl}/daily-permissions`;

  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<DailyPermission[]> {
    return this.http.get<DailyPermission[]>(this.apiUrl);
  }

  getPermissionById(id: string): Observable<DailyPermission> {
    return this.http.get<DailyPermission>(`${this.apiUrl}/${id}`);
  }

  addPermission(permission: DailyPermission): Observable<DailyPermission> {
    return this.http.post<DailyPermission>(this.apiUrl, permission);
  }

  updatePermission(id: string, permission: DailyPermission): Observable<DailyPermission> {
    return this.http.put<DailyPermission>(`${this.apiUrl}/${id}`, permission);
  }

  // Additional methods as needed
}
