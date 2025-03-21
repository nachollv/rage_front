import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CentroDeProduccion {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  fecha_registro: Date;
  ultimo_inicio_sesion: Date;
  caducidad_contrasena: Date;
  id_empresa: number;
  deleted_at: Date
}

@Injectable({
  providedIn: 'root',
})

export class ProductioncenterService {
  //private apiUrl = 'https://pre.tramits.idi.es/public/index.php/auth';
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';


  constructor(private http: HttpClient) {}

  // Obtener todas los Centros de producción
  getAllCentrosDeProduccion(): Observable<CentroDeProduccion[]> {
    return this.http.get<CentroDeProduccion[]>(`${this.apiUrl}/centrodeproduccion`);
  }

  // Obtener un Centro De Produccion
  getCentroDeProduccionByID(id: number): Observable<CentroDeProduccion> {
    return this.http.get<CentroDeProduccion>(`${this.apiUrl}/centrodeproduccion/${id}`);
  }

  // Obtener los Centros De Produccion de una Organización
  getCentrosDeProduccionFromOrganizacion(id_empresa: number): Observable<CentroDeProduccion> {
    return this.http.get<CentroDeProduccion>(`${this.apiUrl}/users/organizacion/${id_empresa}`);
  }

  // Crear una nueva Centro De Produccion
  crearCentroDeProduccion(centrodeproduccion: CentroDeProduccion): Observable<CentroDeProduccion> {
    return this.http.post<CentroDeProduccion>(`${this.apiUrl}/centrodeproduccion/register`, centrodeproduccion);
  }

  // Actualizar una Centro De Produccion existente
  actualizarCentroDeProduccion(id: number, centrodeproduccion: CentroDeProduccion): Observable<CentroDeProduccion> {
    return this.http.put<CentroDeProduccion>(
      `${this.apiUrl}/centrodeproduccion/update/${id}`,
      centrodeproduccion
    );
  }

  // Eliminar una Centro De Produccion
  eliminarCentroDeProduccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/centrodeproduccion/delete/${id}`);
  }
}
