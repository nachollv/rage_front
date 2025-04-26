import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScopeOneRecordsService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Manejar errores de forma genérica
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error); // Log para depuración
    let errorMessage = 'Algo salió mal. Por favor, intenta de nuevo más tarde.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor (Código: ${error.status}). Mensaje: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Obtener un registro por ID
  getRecord(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/scopeonerecords/show/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo registro
  createRecord(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/scopeonerecords/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un registro por ID
  updateRecord(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/scopeonerecords/update/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un registro por ID
  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/scopeonerecords/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener registros por calculationYear y productionCenter
  getRecordsByFilters(activityYear: number, productionCenter?: number, activityType?: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/scopeonerecords/activityYear/${activityYear}/productionCenter/${productionCenter}/activityType/${activityType}`, {
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejar solicitudes preflight (opcional)
  preflight(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    });

    return this.http.options(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
