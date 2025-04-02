import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Flight {
  id: number;
  flightCode: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  status: number;
  departureAirportId: number;
  arrivalAirportId: number;
  aircraftId: number;
  departureAirportName: string;
  arrivalAirportName: string;
  airlineName: string;
  airlineId: number;
  aircraftName: string;
}

export interface CreateFlightRequest {
  flightCode: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  status: number;
  departureAirportId: number;
  arrivalAirportId: number;
  aircraftId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = '/prx/api/flights';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // hoặc lấy token từ auth service của bạn
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getFlight(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createFlight(flight: CreateFlightRequest): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, flight, { headers: this.getHeaders() });
  }

  updateFlight(id: number, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${id}`, flight, { headers: this.getHeaders() });
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}