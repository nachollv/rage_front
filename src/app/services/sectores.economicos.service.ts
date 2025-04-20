import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectoresEconomicosService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Obtener todos los sectores económicos
  getSectoresEconomicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sectores-economicos`)
      .pipe(catchError(this.handleError));
  }

  // Obtener un sector económico por código
  getSectorEconomico(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sectores-economicos/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo sector económico
  createSectorEconomico(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sectores-economicos/create`, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un sector económico por código
  updateSectorEconomico(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/sectores-economicos/update/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un sector económico por código
  deleteSectorEconomico(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sectores-economicos/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor (${error.status}): ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
