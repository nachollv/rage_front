import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

/* const jwtHelper = new JwtHelperService();
const token = localStorage.getItem('authToken');

if (!token) {
    console.log('Token no encontrado desde auth.');
} else {
    console.log('Token válido:', !jwtHelper.isTokenExpired(token));
    console.log('Fecha de expiración:', jwtHelper.getTokenExpirationDate(token));
} */

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}
  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = localStorage.getItem('authToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      console.log('Token expira :', this.jwtHelper.getTokenExpirationDate(token));
      return true; // Token válido, se puede acceder a la ruta
    } else {
      // Redirige a la página de inicio de sesión, se acabó el tiempo de sesión
      return this.router.createUrlTree(['/login']);
    }
  }
}

