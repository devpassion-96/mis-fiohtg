import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from 'src/app/models/training.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly apiUrl = `${environment.apiUrl}/trainings`;

  constructor(private http: HttpClient) {}

  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getTrainingById(id: string): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  addTraining(training: Training): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  updateTraining(id: string, training: Training): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  deleteTraining(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
