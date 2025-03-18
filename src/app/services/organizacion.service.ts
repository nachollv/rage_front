import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Organizacion {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root',
})

export class OrganizacionService {
  private apiUrl = 'https://pre.tramits.idi.es/public/index.php';

  constructor(private http: HttpClient) {}

  // Obtener todas las organizaciones
  getOrganizaciones(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(this.apiUrl);
  }

  // Obtener una organización por ID
  getOrganizacion(id: string): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.apiUrl}/organizacion/${id}`);
  }

  // Obtener una organización por Email
  getOrganizacionByEmail(email: string): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.apiUrl}/organizacion/search/${encodeURIComponent(email)}`);
  }

  // Crear una nueva organización
  crearOrganizacion(organizacion: Organizacion): Observable<Organizacion> {
    return this.http.post<Organizacion>(`${this.apiUrl}/organizacion/register`, organizacion);
  }

  // Actualizar una organización existente
  actualizarOrganizacion(id: number, organizacion: Organizacion): Observable<Organizacion> {
    return this.http.put<Organizacion>(
      `${this.apiUrl}/organizacion/${id}`,
      organizacion
    );
  }

  // Eliminar una organización
  eliminarOrganizacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/organizacion/${id}`);
  }
}
