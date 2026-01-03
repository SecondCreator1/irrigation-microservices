import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgrammeArrosage } from '../models/programme-arrosage.model';

@Injectable({
  providedIn: 'root'
})
export class ArrosageService {
  private gatewayUrl = 'http://localhost:9094/arrosage';
  private programmeApiUrl = `${this.gatewayUrl}/programme`;

  constructor(private http: HttpClient) { }

  getProgrammesByParcelle(parcelleId: number): Observable<ProgrammeArrosage[]> {
    return this.http.get<ProgrammeArrosage[]>(`${this.programmeApiUrl}/parcelle/${parcelleId}`);
  }

  getProgramme(id: number): Observable<ProgrammeArrosage> {
    return this.http.get<ProgrammeArrosage>(`${this.programmeApiUrl}/${id}`);
  }

  createProgramme(programme: ProgrammeArrosage): Observable<ProgrammeArrosage> {
    return this.http.post<ProgrammeArrosage>(`${this.programmeApiUrl}/add`, programme);
  }

  createProgrammeWithMeteo(stationId: number, programme: ProgrammeArrosage): Observable<ProgrammeArrosage> {
    return this.http.post<ProgrammeArrosage>(`${this.programmeApiUrl}/add-with-meteo/${stationId}`, programme);
  }

  updateProgramme(id: number, programme: ProgrammeArrosage): Observable<ProgrammeArrosage> {
    return this.http.put<ProgrammeArrosage>(`${this.programmeApiUrl}/update/${id}`, programme);
  }

  deleteProgramme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.programmeApiUrl}/delete/${id}`);
  }
}
