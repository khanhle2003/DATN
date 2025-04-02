import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = `/prx/api/auth`;
  
  constructor(private http: HttpClient) {}
  sendOtp(email: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');
    return this.http.post(`${this.apiUrl}/send-otp`, email, { headers, responseType: 'text' }).pipe(
      map(response => {
        console.log('Send OTP raw response:', response);
        return { success: true, message: response || 'OTP sent successfully' };
      }),
      catchError(error => {
        console.error('Send OTP error:', error);
        return throwError(() => error);
      })
    );
  }
  verifyOtp(request: { email: string, otp: string }): Observable<any> {
    console.log('Verifying OTP with request:', request);

    return this.http.post(`${this.apiUrl}/verify-otp`, request, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Raw verify OTP response:', response);

        if (!response) {
          return { success: true };
        }

        try {
          return JSON.parse(response);
        } catch (e) {

          return { success: true, message: response };
        }
      }),
      catchError(error => {
        console.error('Verify OTP error:', error);
        return throwError(() => error);
      })
    );
  }
}