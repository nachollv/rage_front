import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.get(`${this.apiUrl}/emisionesmachinery`).pipe(catchError(this.handleError));
  }

  getEmisionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionesmachinery/${id}`).pipe(catchError(this.handleError));
  }

  createEmision(emision: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emisionesmachinery/create`, emision).pipe(catchError(this.handleError));
  }

  updateEmision(id: number, emision: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/emisionesmachinery/update/${id}`, emision).pipe(catchError(this.handleError));
  }

  deleteEmision(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emisionesmachinery/delete/${id}`).pipe(catchError(this.handleError));
  }

  getEmisionesByYear(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionesmachinery/activityYear/${year}`).pipe(catchError(this.handleError));
  }
}
