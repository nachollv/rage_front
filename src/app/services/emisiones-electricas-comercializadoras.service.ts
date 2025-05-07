// emisioneselectricasedificios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface EmisionesComercializadoraElectrica {
  id: number;         // Identificador único de la emisión
  nombreComercial: string;     // Nombre descriptivo de la emisión
  kg_CO2_kWh: string;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmisionesElectricaComercializadorasService {

  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de estado: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMessage); // Puedes optar por registrar el error
    return throwError(() => new Error(errorMessage));
  }

  // Crear una nueva emisión eléctrica
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emisioneselectricascomercializadoras/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Leer todas las emisiones eléctricas
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisioneselectricascomercializadoras`).pipe(
      catchError(this.handleError)
    );
  }

  // Leer una emisión eléctrica específica por ID
  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/emisioneselectricascomercializadoras/${id}`).pipe(
      catchError(this.handleError)
    );
  }

    // Leer una emisión eléctrica específica por ID
    getByYear(year: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/emisioneselectricascomercializadoras/activityYear/${year}`).pipe(
        catchError(this.handleError)
      );
    }

  // Actualizar una emisión eléctrica específica por ID
  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/emisioneselectricascomercializadoras/update/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una emisión eléctrica específica por ID
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emisioneselectricascomercializadoras/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}

