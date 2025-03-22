import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
  
export interface EmisionesCombustibles {
    id: number;         // Identificador único de la emisión
    Combustible: string;     // Nombre descriptivo de la emisión
    Anio: string;
    CO2_kg_ud: number;
    CH4_g_ud: number;
    N2O_g_ud: number;
    cantidad: number;   // Cantidad de emisiones (por ejemplo, en toneladas)
    fecha: string;      // Fecha de registro de la emisión en formato ISO (YYYY-MM-DD)
  }
  
  @Injectable({
    providedIn: 'root',
  })

export class FuelDataService {
  //private apiUrl = 'https://pre.tramits.idi.es/public/index.php/auth';
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

    constructor(private http: HttpClient) {}
  
    getAll(): Observable<EmisionesCombustibles[]> {
      return this.http.get<EmisionesCombustibles[]>(`${this.apiUrl}/emisionescombustibles`).pipe(
        catchError(this.handleError)
      );
    }
  
    getById(id: number): Observable<EmisionesCombustibles> {
      return this.http.get<EmisionesCombustibles>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    getByYear(year: number): Observable<EmisionesCombustibles> {
      return this.http.get<EmisionesCombustibles>(`${this.apiUrl}/emisionescombustibles/year/${year}`).pipe(
        catchError(this.handleError)
      );
    }

    getByYearType(year: number, fuelType:string): Observable<EmisionesCombustibles> {
      return this.http.get<EmisionesCombustibles>(`${this.apiUrl}/${year}`).pipe(
        catchError(this.handleError)
      );
    }
  
    create(data: EmisionesCombustibles): Observable<EmisionesCombustibles> {
      return this.http.post<EmisionesCombustibles>(`${this.apiUrl}/create`, data).pipe(
        catchError(this.handleError)
      );
    }
  
    update(id: number, data: EmisionesCombustibles): Observable<EmisionesCombustibles> {
      return this.http.put<EmisionesCombustibles>(`${this.apiUrl}/${id}`, data).pipe(
        catchError(this.handleError)
      );
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Ha ocurrido un error desconocido.';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error del cliente: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage = `Error del servidor: Código ${error.status}, ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }
  }
  