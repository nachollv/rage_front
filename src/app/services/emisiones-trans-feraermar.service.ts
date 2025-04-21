import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmisionesTransFerAerMarService {

  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Error en la API:', error);
    return throwError(() => error.error?.messages?.error || 'Error en la solicitud');
  }

  getEmisiones(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(catchError(this.handleError));
  }

  getEmisionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionescombustiblestransportefermar/${id}`).pipe(catchError(this.handleError));
  }

  createEmision(emision: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emisionescombustiblestransportefermar/create`, emision).pipe(catchError(this.handleError));
  }

  updateEmision(id: number, emision: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/emisionescombustiblestransportefermar/update/${id}`, emision).pipe(catchError(this.handleError));
  }

  deleteEmision(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emisionescombustiblestransportefermar/delete/${id}`).pipe(catchError(this.handleError));
  }

  getEmisionesByYear(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisionescombustiblestransportefermar/year/${year}`).pipe(catchError(this.handleError));
  }
}
