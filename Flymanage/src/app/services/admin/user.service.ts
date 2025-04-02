import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError, of } from 'rxjs';
import { PersonCreateDTO, ERole, PersonDTO } from '../../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/prx/api/persons';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<PersonDTO[]> {
    return this.http.get<PersonDTO[]>(this.apiUrl);
  }

    getUser(id: number): Observable<PersonDTO> {
    return this.http.get<PersonDTO>(`${this.apiUrl}/${id}`);
  }

  createUser(userDTO: PersonCreateDTO): Observable<PersonDTO> {
    return this.http.post<PersonDTO>(this.apiUrl, userDTO);
  }

  updateUser(id: number, userDTO: Partial<PersonDTO>): Observable<PersonDTO> {
    return this.http.put<PersonDTO>(`${this.apiUrl}/${id}`, userDTO);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPersonsByRole(role: ERole): Observable<PersonDTO[]> {
    return this.http.get<PersonDTO[]>(`${this.apiUrl}/role/${role}`);
        }

  updateUserRoles(id: number, roles: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/roles`, roles);
  }

  getUserProfile(): Observable<PersonDTO> {
    const userId = localStorage.getItem('userId');
    return this.http.get<PersonDTO>(`${this.apiUrl}/${userId}`);
  }

  changePassword(request: any): Observable<any> {
    console.log('Change password request:', request);
    
    return this.http.post(`${this.apiUrl}/change-password`, request, { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    }).pipe(
      map(response => {
        console.log('Change password raw response:', response);
        return { success: true, message: response || 'Password changed successfully' };
      }),
      catchError(error => {
        console.error('Change password error:', error);

        if (error.message && error.message.includes('Http failure during parsing')) {
          console.log('Detected parsing error but API might have succeeded');
          return [{ success: true, message: 'Password change likely succeeded' }];
        }
        return throwError(() => error);
      })
    );
  }

  getAvatar(userId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${userId}/avatar`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      },
      responseType: 'text'
    });
  }

  uploadAvatar(id: number, file: File): Observable<PersonDTO> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PersonDTO>(`${this.apiUrl}/${id}/avatar`, formData);
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}