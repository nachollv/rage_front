import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
  
export interface vehicleFuel {
    id: number;         // Identificador único de la emisión
    Combustible: string;     // Nombre descriptivo de la emisión
    Categoria: string; // Tipo de vehículo
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

  export class VehiclesFuelConsumptionService {
  
    private apiUrl = 'https://pre.tramits.idi.es/public/index.php';

    constructor(private http: HttpClient) {}
  
    getAll(): Observable<vehicleFuel[]> {
      return this.http.get<vehicleFuel[]>(`${this.apiUrl}/emisionescombustiblesvehiculos`).pipe(
        catchError(this.handleError)
      );
    }
  
    getById(id: number): Observable<vehicleFuel> {
      return this.http.get<vehicleFuel>(`${this.apiUrl}/emisionescombustiblesvehiculos/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    getByYear(year: number): Observable<vehicleFuel> {
      return this.http.get<vehicleFuel>(`${this.apiUrl}/emisionescombustiblesvehiculos/year/${year}`).pipe(
        catchError(this.handleError)
      );
    }

    getByYearType(year: number, vehicleType: string): Observable<vehicleFuel> {
      return this.http.get<vehicleFuel>(`${this.apiUrl}/emisionescombustiblesvehiculos/year/${year}/type/${vehicleType}`, {
        params: {
          vehicleType: vehicleType
        }
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    create(data: vehicleFuel): Observable<vehicleFuel> {
      return this.http.post<vehicleFuel>(`${this.apiUrl}/emisionescombustiblesvehiculos/vehicleFuel`, data).pipe(
        catchError(this.handleError)
      );
    }
  
    update(id: number, data: vehicleFuel): Observable<vehicleFuel> {
      return this.http.put<vehicleFuel>(`${this.apiUrl}/emisionescombustiblesvehiculos/vehicleFuel/${id}`, data).pipe(
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