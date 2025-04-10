import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Organizacion {
  id: number;
  companyName: string;
  descripcion: string;
  activa: boolean;
  cif: string;
  cnae: string;
  email: string;
  multipleProductionCenter: boolean;
  organizationType: number;
  zipCode: string;
}

@Injectable({
  providedIn: 'root',
})

export class OrganizacionService {
  // URL de la API
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php';

  constructor(private http: HttpClient) {}

  // Obtener todas las organizaciones
  getOrganizaciones(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(`${this.apiUrl}/organizacion`);
  }

  // Obtener una organización por ID
  getOrganizacion(id: number): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.apiUrl}/organizacion/${id}`)
  }

  // Crear una nueva organización
  crearOrganizacion(organizacion: Organizacion): Observable<Organizacion> {
    return this.http.post<Organizacion>(`${this.apiUrl}/organizacion/create`, organizacion)
  }

  // Actualizar una organización existente
  actualizarOrganizacion(id: number, organizacion: Organizacion): Observable<Organizacion> {
    return this.http.put<Organizacion>(`${this.apiUrl}/organizacion/update/${id}`,organizacion)
  }

  // Eliminar una organización
  eliminarOrganizacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/organizacion/delete/${id}`);
  }

  /* Años de actividad permitidos para la organización */
  // Obtener todos los registros
  getAllActivityYear(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activityYear`)
  }

  // Obtener un registro específico por ID
  getByIdActivityYear(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/activityYear/${id}`)
  }

  // Crear un nuevo registro
  createActivityYear(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/activityYear`, data);
  }

  // Actualizar un registro por ID
  updateActivityYear(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/activityYear/${id}`, data, )
  }

  // Obtener los años de actividad por organización
  getActivityYearsByOrganization(organizacionID: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/activityYear/organization/${organizacionID}`);
  }
}
