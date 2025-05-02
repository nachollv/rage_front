import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecoveryPasswordService {
  private apiUrl = 'https://tramits.idi.es/public/index.php/recovery';

  constructor(private http: HttpClient) {}

  sendRecoveryEmail(email: string): Observable<any> {
    const body = { email };

    return this.http.post(`${this.apiUrl}/password`, body).pipe(
      catchError((error) => {
        // Manejar el error y procesar el contenido del mensaje
        let errorMessage = 'Ocurrió un error desconocido';
        if (error.error) {
          if (error.error.error) {
            errorMessage = error.error.error; // Mensaje de error genérico del servidor
          }
          if (error.error.debug) {
            errorMessage += ` ##Detalles técnicos: ${error.error.debug}`; // Mensaje de depuración del servidor
          }
        } else if (error.error instanceof ErrorEvent) {
          // Error del lado cliente
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
        }
        return throwError(() => new Error(errorMessage)); // Retornar el mensaje de error procesado al componente
      })
    );
  }
}
