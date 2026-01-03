import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalArrosage } from '../models/journal-arrosage.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private gatewayUrl = 'http://localhost:9094/arrosage';
  private apiUrl = `${this.gatewayUrl}/journal`;

  constructor(private http: HttpClient) { }

  getJournalsByProgramme(programmeId: number): Observable<JournalArrosage[]> {
    return this.http.get<JournalArrosage[]>(`${this.apiUrl}/programme/${programmeId}`);
  }

  getJournal(id: number): Observable<JournalArrosage> {
    return this.http.get<JournalArrosage>(`${this.apiUrl}/${id}`);
  }

  createJournal(journal: JournalArrosage): Observable<JournalArrosage> {
    return this.http.post<JournalArrosage>(`${this.apiUrl}/add`, journal);
  }

  deleteJournal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
