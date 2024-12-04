import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeetingMinutes } from 'src/app/models/messaging-feature/minutes.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MeetingMinutesService {
  private readonly apiUrl = `${environment.apiUrl}/meetings`;

  constructor(private http: HttpClient) {}

  getAllMeetingMinutesRecords(): Observable<MeetingMinutes[]> {
    return this.http.get<MeetingMinutes[]>(this.apiUrl);
  }

  getMeetingMinutesById(id: string): Observable<MeetingMinutes> {
    return this.http.get<MeetingMinutes>(`${this.apiUrl}/${id}`);
  }

  addMeetingMinutesRecord(meetingMinutes: MeetingMinutes): Observable<MeetingMinutes> {
    return this.http.post<MeetingMinutes>(this.apiUrl, meetingMinutes);
  }

  updateMeetingMinutesRecord(id: string, meetingMinutes: MeetingMinutes): Observable<MeetingMinutes> {
    return this.http.put<MeetingMinutes>(`${this.apiUrl}/${id}`, meetingMinutes);
  }

  deleteMeetingMinutesRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



}
