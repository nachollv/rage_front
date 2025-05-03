import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecoveryPasswordService {
  private apiUrl = 'https://tramits.idi.es/public/assets/utils/enviaCorreoElectronicoRAGE.php';

  constructor(private http: HttpClient) {}

  sendRecoveryEmail(email: any): Observable<any> {
    return this.http
    .get<any>(`${this.apiUrl}?${email}`).pipe(
      map(response => {
        console.log ("response.status ", response.status)
        if (response.status === 'success') {
          console.log ("Email sent", response.message)
        } else {
          console.error("Error sending mail: ", response.message)
        }
        return response
      }),
      catchError((error) => {
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
