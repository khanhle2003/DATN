import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SendBookingCodeService {
  private apiUrl = '/prx';
  constructor(private http: HttpClient) { }

  sendBookingCode(bookingId: number, email: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/api/bookings/${bookingId}/send-booking-code`,
      {
        email: email
      },
      { responseType: 'text' }
    );
  }
}