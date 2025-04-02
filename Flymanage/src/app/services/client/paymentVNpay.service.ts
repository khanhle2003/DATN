import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentVNpayService {
  private apiUrl = `/prx/api`;

  constructor(private http: HttpClient) { }

  initiateVnPayPayment(amount: number, bookingIds: string, timestamp?: number): Observable<any> {
    const currentTime = Date.now();
    const maxTransactionTime = 15 * 60 * 1000; // 15 phút tính bằng milliseconds

    if (timestamp && (currentTime - timestamp > maxTransactionTime)) {
      return new Observable(observer => {
        observer.error({ error: 'TRANSACTION_TIMEOUT', message: 'Giao dịch đã quá thời hạn cho phép' });
      });
    }

    let params = new HttpParams()
      .set('amount', amount.toString())
      .set('bookingIds', bookingIds);
      
    if (timestamp) {
      params = params.set('timestamp', timestamp.toString());
    }
    
    return this.http.get(`${this.apiUrl}/payments/vnpay-payment`, {
      params: params,
      responseType: 'text'
    });
  }

  checkTransactionStatus(transactionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/check-status/${transactionId}`);
  }

  updateBookingStatus(bookingIds: number[], status: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/update-booking-status`, {
      bookingIds,
      status
    });
  }
}