import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScopeTwoRecordsService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error); // Registro para depuración
    let errorMessage = 'Ha ocurrido un error inesperado. Intenta de nuevo más tarde.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Obtener todos los registros
  getAllConsumptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scopetworecords`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un registro por ID
  getConsumptionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/scopetworecords/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener registros por calculationYear y productionCenter
  getRecordsByFilters(activityYear: number, productionCenter?: number, activityType?: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/scopetworecords/activityYear/${activityYear}/productionCenter/${productionCenter}/activityType/${activityType}`, {
    }).pipe(
      catchError(this.handleError)
    );
  }


  // Crear un nuevo registro
  createConsumption(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/scopetworecords/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un registro por ID
  updateConsumption(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/scopetworecords/update/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un registro por ID
  deleteConsumption(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/scopetworecords/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
