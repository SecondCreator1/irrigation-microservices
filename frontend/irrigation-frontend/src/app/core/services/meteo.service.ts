import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationMeteo } from '../models/station-meteo.model';
import { Prevision } from '../models/prevision.model';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private gatewayUrl = 'http://localhost:9094/meteo';
  private stationApiUrl = `${this.gatewayUrl}/station`;
  private previsionApiUrl = `${this.gatewayUrl}/prevision`;

  constructor(private http: HttpClient) { }

  // Station endpoints
  getAllStations(): Observable<StationMeteo[]> {
    return this.http.get<StationMeteo[]>(`${this.stationApiUrl}/all`);
  }

  getStation(id: number): Observable<StationMeteo> {
    return this.http.get<StationMeteo>(`${this.stationApiUrl}/${id}`);
  }

  createStation(station: StationMeteo): Observable<StationMeteo> {
    return this.http.post<StationMeteo>(`${this.stationApiUrl}/add`, station);
  }

  updateStation(id: number, station: StationMeteo): Observable<StationMeteo> {
    return this.http.put<StationMeteo>(`${this.stationApiUrl}/update/${id}`, station);
  }

  deleteStation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.stationApiUrl}/delete/${id}`);
  }

  // Prevision endpoints
  getPrevisionsByStationAndDate(stationId: number, date: string): Observable<Prevision[]> {
    return this.http.get<Prevision[]>(`${this.previsionApiUrl}/station/${stationId}/date/${date}`);
  }

  getPrevision(id: number): Observable<Prevision> {
    return this.http.get<Prevision>(`${this.previsionApiUrl}/${id}`);
  }

  createPrevision(stationId: number, prevision: Prevision): Observable<Prevision> {
    return this.http.post<Prevision>(`${this.previsionApiUrl}/add/${stationId}`, prevision);
  }

  deletePrevision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.previsionApiUrl}/delete/${id}`);
  }
}
