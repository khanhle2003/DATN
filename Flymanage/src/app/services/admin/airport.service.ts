
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../../model/airport.interface';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private apiUrl = '/prx/api/airports'; 

  constructor(private http: HttpClient) {}


  getAllAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(this.apiUrl);
  }

  getAirportById(id: number): Observable<Airport> {
    return this.http.get<Airport>(`${this.apiUrl}/${id}`);
  }

  createAirport(airport: Airport): Observable<Airport> {
    return this.http.post<Airport>(this.apiUrl, airport);
  }


  updateAirport(id: number, airport: Airport): Observable<Airport> {
    return this.http.put<Airport>(`${this.apiUrl}/${id}`, airport);
  }


  deleteAirport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}