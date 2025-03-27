
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../../model/airport.interface';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private apiUrl = '/prx/api/airports'; // Đường dẫn API

  constructor(private http: HttpClient) {}

  // Lấy tất cả sân bay
  getAllAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(this.apiUrl);
  }

  // Lấy sân bay theo ID
  getAirportById(id: number): Observable<Airport> {
    return this.http.get<Airport>(`${this.apiUrl}/${id}`);
  }

  // Tạo sân bay mới
  createAirport(airport: Airport): Observable<Airport> {
    return this.http.post<Airport>(this.apiUrl, airport);
  }

  // Cập nhật sân bay
  updateAirport(id: number, airport: Airport): Observable<Airport> {
    return this.http.put<Airport>(`${this.apiUrl}/${id}`, airport);
  }

  // Xóa sân bay
  deleteAirport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}