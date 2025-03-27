// src/app/services/aircraft.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AircraftDTO } from '../../model/aircraft.interface';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {
  private apiUrl = '/prx/api/aircraft'; // Địa chỉ API

  constructor(private http: HttpClient) {}

  getAllAircraft(): Observable<AircraftDTO[]> {
    return this.http.get<AircraftDTO[]>(this.apiUrl);
  }

  getAircraft(id: number): Observable<AircraftDTO> {
    return this.http.get<AircraftDTO>(`${this.apiUrl}/${id}`);
  }

  createAircraft(aircraft: AircraftDTO): Observable<AircraftDTO> {
    return this.http.post<AircraftDTO>(this.apiUrl, aircraft);
  }

  updateAircraft(id: number, aircraft: AircraftDTO): Observable<AircraftDTO> {
    return this.http.put<AircraftDTO>(`${this.apiUrl}/${id}`, aircraft);
  }

  deleteAircraft(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}