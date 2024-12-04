import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly apiUrl = `${environment.apiUrl}/departments`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: string): Observable<Department> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Department>(url);
  }

  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department, this.httpOptions);
  }

  updateDepartment(department: Department): Observable<any> {
    const url = `${this.apiUrl}/${department._id}`;
    return this.http.put(url, department, this.httpOptions);
  }

  deleteDepartment(id: string): Observable<Department> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Department>(url, this.httpOptions);
  }



}
