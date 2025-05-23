import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RanquingCalculationService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php'
  
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

    // Obtener totales de registros por calculationYear, productionCenter, fuelType y activityType de alcance 1
    getTotalizedRecordsByFiltersScopeOne(activityYear: number, productionCenter?: number, fuelType?:number, activityType?: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/scopeonerecords/totals/${activityYear}/productionCenter/${productionCenter}/fuelType/${fuelType}/activityType/${activityType}`, {
      }).pipe(
        catchError(this.handleError)
      );
    }
    // Obtener totales de registros por calculationYear, productionCenter, fuelType y activityType de alcance 2
    getTotalizedRecordsByFiltersScopeTwo(activityYear: number, productionCenter?: number, activityType?: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/scopetworecords/totals/${activityYear}/productionCenter/${productionCenter}/activityType/${activityType}`, {
      }).pipe(
        catchError(this.handleError)
      );
    }
    // Obtener totales de registros por calculationYear, productionCenter de emisiones fugitivas
    getTotalizedRecordsByFiltersFugitiveEmissions(activityYear: number, productionCenter?: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/registroemisionesfugas/totals/${activityYear}/productionCenter/${productionCenter}`, {
      }).pipe(
        catchError(this.handleError)
      );
    }
}
