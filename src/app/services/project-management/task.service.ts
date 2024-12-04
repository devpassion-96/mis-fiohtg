import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/project-management/task.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAllTaskRecords(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  addTaskRecord(Task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, Task);
  }

  updateTaskRecord(id: string, Task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, Task);
  }

  deleteTaskRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
