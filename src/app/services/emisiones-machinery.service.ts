import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmisionesMachineryService {

  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Error en la API:', error);
    return throwError(() => error.error?.messages?.error || 'Error en la solicitud');
  }

  getEmisiones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionesmaquinaria`).pipe(catchError(this.handleError));
  }

  getEmisionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionesmaquinaria/${id}`).pipe(catchError(this.handleError));
  }

  createEmision(emision: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emisionesmaquinaria/create`, emision).pipe(catchError(this.handleError));
  }

  updateEmision(id: number, emision: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/emisionesmaquinaria/update/${id}`, emision).pipe(catchError(this.handleError));
  }

  deleteEmision(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emisionesmaquinaria/delete/${id}`).pipe(catchError(this.handleError));
  }

  getEmisionesByYear(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionesmaquinaria/activityYear/${year}`).pipe(catchError(this.handleError));
  }
}
