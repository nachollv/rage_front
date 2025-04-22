import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroemisionesFugasService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Crear registro
  createRegistro(registro: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registroemisionesfugas`, registro).pipe(
      catchError(this.handleError)
    );
  }

  // Leer todos los registros
  getRegistros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/registroemisionesfugas`).pipe(
      catchError(this.handleError)
    );
  }

  // Leer un registro por ID
  getRegistroById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registroemisionesfugas/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Leer un registro por año de cálculo, centro de producción
  getRegistroByFilters(calculationYear: number, productionCenter: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/registroemisionesfugas/activityYear/${calculationYear}/productionCenter/${productionCenter}`)
    .pipe(
      catchError(this.handleError))
  }

  // Actualizar un registro
  updateRegistro(id: number, registro: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/registroemisionesfugas/${id}`, registro).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un registro
  deleteRegistro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/registroemisionesfugas/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Gestión de errores
  private handleError(error: HttpErrorResponse) {
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      errorMsg = `Error código: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMsg);
    return throwError(() => new Error('Hubo un problema; intenta más tarde.'));
  }
}
