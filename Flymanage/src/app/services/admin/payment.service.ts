import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `/prx/api/payments`;

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPayment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: { amount: number, method: string, bookingIds: number[] }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 