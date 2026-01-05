import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalArrosage } from '../models/journal-arrosage.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private gatewayUrl = 'http://localhost:9094/arrosage';
  private journalApiUrl = `${this.gatewayUrl}/journal`;

  constructor(private http: HttpClient) { }

  getAllJournaux(): Observable<JournalArrosage[]> {
    return this.http.get<JournalArrosage[]>(`${this.journalApiUrl}/all`);
  }

  getJournalsByProgramme(programmeId: number): Observable<JournalArrosage[]> {
    return this.http.get<JournalArrosage[]>(`${this.journalApiUrl}/programme/${programmeId}`);
  }

  getJournal(id: number): Observable<JournalArrosage> {
    return this.http.get<JournalArrosage>(`${this.journalApiUrl}/${id}`);
  }

  createJournal(journal: JournalArrosage): Observable<any> {
    return this.http.post(`${this.journalApiUrl}/add`, journal);
  }

  deleteJournal(id: number): Observable<any> {
    return this.http.delete(`${this.journalApiUrl}/delete/${id}`);
  }
}
