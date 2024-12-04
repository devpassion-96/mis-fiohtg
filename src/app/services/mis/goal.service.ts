import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../../models/goal.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private readonly apiUrl = `${environment.apiUrl}/goals`;


  constructor(private http: HttpClient) {}

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal);
  }

  getAllGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  getGoalById(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/${id}`);
  }

  updateGoal(id: string, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
