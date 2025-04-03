import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php/users';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError) // Gestión de errores
      );
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener usuarios por organización
  getUsersByOrganization(orgId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizacion/${orgId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un usuario
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  generatePassword(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?"; // Conjunto de caracteres permitidos
    const passwordLength = 8; /* por defecto, pero debe ser configurable desde el panel admin */
    let password = "";
  
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
  }

  // Método auxiliar para manejar errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
    }

    console.error(errorMessage); // Log del error (opcional)
    return throwError(() => new Error(errorMessage));
  }

  // Cabeceras para autenticación
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer [tu-token-de-autenticación]', // Reemplaza con un token válido
    });
  }
}
