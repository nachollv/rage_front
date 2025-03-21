import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'https://pre.tramits.idi.es/public/index.php/auth';
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php/auth';


  private userRole = new BehaviorSubject<string>(''); // Observa el rol del usuario
  constructor(private http: HttpClient) {}
  currentUserRole$ = this.userRole.asObservable(); // Observable para suscribirse

  setRole(role: string): void {
    this.userRole.next(role); // Actualiza el rol del usuario
  }
  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  // Método para almacenar el token en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
