import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface YearlyStatistic {
  year: number;
  total: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient) {}

  getYearlyStatistics(years: number[]): Observable<YearlyStatistic[]> {
    return this.http.post<YearlyStatistic[]>(
      `${this.baseUrl}/payments/yearly-statistics`,
      { years }
    );
  }
} 