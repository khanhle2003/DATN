import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
  private apiUrl = '/prx/api/airlines';
  constructor(private http: HttpClient) { }

  getAirlines(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addAirline(airline: any): Observable<any> {
    return this.http.post(this.apiUrl, airline);
  }

  updateAirline(airline: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${airline.id}`, airline);
  }

  deleteAirline(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  addNewAirline(newAirline: any): Observable<any> {
    return this.addAirline(newAirline); 
  }
}