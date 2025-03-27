import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface YearlyStatistic {
  year: number;
  total: number;
  count: number;
}

interface BookingStatistic {
  period: string;
  totalBookings: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = '/prx/api/statistics';

  constructor(private http: HttpClient) {}

  getYearlyStatistics(years: number[]): Observable<YearlyStatistic[]> {
    return this.http.post<YearlyStatistic[]>(
      `${this.baseUrl}/payments/yearly-statistics`,
      { years }
    );
  }

  getBookingStatistics(years: number[]): Observable<BookingStatistic[]> {
    return this.http.post<BookingStatistic[]>(
      `${this.baseUrl}/payments/booking-statistics/yearly`,
      { years }
    );
  }
} 