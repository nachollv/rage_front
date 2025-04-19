import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuxTextDTO } from '../models/auxText.dto';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

const URL_API_JSON = '../../assets/json/'


@Injectable({
  providedIn: 'root'
})

export class AuxHelpingTextsService {

  constructor( private http: HttpClient ) {}

  getAuxTexts(): Observable<AuxTextDTO[]> {
    return this.http.get<AuxTextDTO[]>(`${URL_API_JSON}aux-text-repository.json`)
    .pipe(catchError(this.handleError));
  }

  getAuxTextById(id: number): Observable<AuxTextDTO | undefined> {
    return this.getAuxTexts().pipe(
      map((texts) => texts.find((text) => text.id === id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error en la solicitud: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
