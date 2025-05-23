import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface EmisionesLeakRefrigerantGases {
  id: number;         // Identificador único de la emisión
  Nombre: string;     // Nombre descriptivo de la emisión
  FormulaQuimica: string;
  PCA_6AR: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeakrefrigerantgasesService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // GET all registros
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/emisionesfugitivasclimrefr`).pipe(
      catchError((error) => {
        console.error('Error en GET all:', error);
        throw error;
      })
    );
  }

  // GET registro por ID
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/emisionesfugitivasclimrefr/${id}`).pipe(
      catchError((error) => {
        console.error('Error en GET by ID:', error);
        throw error;
      })
    );
  }

  // POST para crear un nuevo registro
  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/emisionesfugitivasclimrefr/create`, data).pipe(
      catchError((error) => {
        console.error('Error en POST:', error);
        throw error;
      })
    );
  }

  // PUT para actualizar un registro existente
  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/emisionesfugitivasclimrefr/update/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error en PUT:', error);
        throw error;
      })
    );
  }

  // DELETE para eliminar un registro
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/emisionesfugitivasclimrefr/delete/${id}`).pipe(
      catchError((error) => {
        console.error('Error en DELETE:', error);
        throw error;
      })
    );
  }

  // OPTIONS para obtener opciones de configuración del endpoint
  options(): Observable<any> {
    return this.http.options<any>(`${this.apiUrl}/emisionesfugitivasclimrefr`).pipe(
      catchError((error) => {
        console.error('Error en OPTIONS:', error);
        throw error;
      })
    );
  }
}