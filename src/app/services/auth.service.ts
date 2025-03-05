import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor() {}

  // Método para establecer el token
  setToken(token: string) {
    sessionStorage.setItem('jwtToken', token);
  }

  // Método para obtener el token
  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }

  clearToken() {
    sessionStorage.removeItem('jwtToken');
  }
}