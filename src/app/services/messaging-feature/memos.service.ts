import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Memo } from 'src/app/models/messaging-feature/memos.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MemoService {
  private readonly apiUrl = `${environment.apiUrl}/memos`;

  constructor(private http: HttpClient) {}

  getAllMemoRecords(): Observable<Memo[]> {
    return this.http.get<Memo[]>(this.apiUrl);
  }

  getMemoById(id: string): Observable<Memo> {
    return this.http.get<Memo>(`${this.apiUrl}/${id}`);
  }

  addMemoRecord(memo: Memo): Observable<Memo> {
    return this.http.post<Memo>(this.apiUrl, memo);
  }

  updateMemoRecord(id: string, memo: Memo): Observable<Memo> {
    return this.http.put<Memo>(`${this.apiUrl}/${id}`, memo);
  }

  deleteMemoRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
