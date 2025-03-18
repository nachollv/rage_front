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
  getOrganizacion(id: number): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.apiUrl}/${id}`);
  }

  // Obtener una organización por Email
  getOrganizacionByEmail(email: string): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.apiUrl}/search/${encodeURIComponent(email)}`);
  }

  // Crear una nueva organización
  crearOrganizacion(organizacion: Organizacion): Observable<Organizacion> {
    return this.http.post<Organizacion>(`${this.apiUrl}/register`, organizacion);
  }

  // Actualizar una organización existente
  actualizarOrganizacion(organizacion: Organizacion): Observable<Organizacion> {
    return this.http.put<Organizacion>(
      `${this.apiUrl}/${organizacion.id}`,
      organizacion
    );
  }

  // Eliminar una organización
  eliminarOrganizacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
