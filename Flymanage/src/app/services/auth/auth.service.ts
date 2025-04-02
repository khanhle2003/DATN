import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/prx/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userName = new BehaviorSubject<string | null>(null);
  private rolesSubject = new BehaviorSubject<string[]>([]);
  
  isLoggedIn$ = this.loggedIn.asObservable();
  userName$ = this.userName.asObservable();
  roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    const fullName = this.getFullName();
    const email = this.getEmail();
    if (token && fullName) {
      this.loggedIn.next(true);
      this.userName.next(fullName);
      console.log('User email:', email);
    }

    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.rolesSubject.next(roles);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  login(credentials: {username: string, password: string}) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    
    return this.http.post(`${this.apiUrl}/login`, {
      username: credentials.username,
      password: credentials.password
    }, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    this.loggedIn.next(false);
    this.userName.next(null);
    this.rolesSubject.next([]);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  setRoles(roles: string[]): void {
    this.rolesSubject.next(roles);
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn.next(status);
  }

  setFullName(fullName: string): void {
    this.userName.next(fullName);
  }

  setEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, JSON.stringify(email), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    });
  }

  resetPassword(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email: email,
      otp: otp
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    });
  }
} 