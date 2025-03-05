   import { Injectable } from '@angular/core';
   import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
   import { Observable, throwError } from 'rxjs';
   import { catchError, map } from 'rxjs/operators';

   interface CNAEGroup {
     code: string;
     description: string;
   }

   interface OrganizationType {
     type: string;
     description: string;
   }

   @Injectable({
     providedIn: 'root'
   })
   export class DataService {
     private baseUrl = 'https://back.rage.es'; // Base URL del backend

     private cnaeGroupsUrl = `${this.baseUrl}/cnae-groups`; // Endpoint para grupos CNAE
     private organizationTypesUrl = `${this.baseUrl}/organization-types`; // Endpoint para tipos de organización

     private httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
     };

     constructor(private http: HttpClient) {}

     // Obtener todos los grupos CNAE
     getCNAEGroups(): Observable<CNAEGroup[]> {
       return this.http.get<CNAEGroup[]>(this.cnaeGroupsUrl).pipe(
         catchError(this.handleError)
       );
     }

     // Obtener un grupo CNAE por código
     getCNAEGroup(code: string): Observable<CNAEGroup | undefined> {
       const url = `${this.cnaeGroupsUrl}/${code}`;
       return this.http.get<CNAEGroup>(url).pipe(
         catchError(this.handleError)
       );
     }

     // Crear un nuevo grupo CNAE
     addCNAEGroup(group: CNAEGroup): Observable<CNAEGroup> {
       return this.http.post<CNAEGroup>(this.cnaeGroupsUrl, group, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Actualizar un grupo CNAE existente
     updateCNAEGroup(group: CNAEGroup): Observable<CNAEGroup> {
       const url = `${this.cnaeGroupsUrl}/${group.code}`;
       return this.http.put<CNAEGroup>(url, group, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Eliminar un grupo CNAE por código
     deleteCNAEGroup(code: string): Observable<{}> {
       const url = `${this.cnaeGroupsUrl}/${code}`;
       return this.http.delete(url, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Obtener todos los tipos de organización
     getOrganizationTypes(): Observable<OrganizationType[]> {
       return this.http.get<OrganizationType[]>(this.organizationTypesUrl).pipe(
         catchError(this.handleError)
       );
     }

     // Obtener un tipo de organización por tipo
     getOrganizationType(type: string): Observable<OrganizationType | undefined> {
       const url = `${this.organizationTypesUrl}/${type}`;
       return this.http.get<OrganizationType>(url).pipe(
         catchError(this.handleError)
       );
     }

     // Crear un nuevo tipo de organización
     addOrganizationType(type: OrganizationType): Observable<OrganizationType> {
       return this.http.post<OrganizationType>(this.organizationTypesUrl, type, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Actualizar un tipo de organización existente
     updateOrganizationType(type: OrganizationType): Observable<OrganizationType> {
       const url = `${this.organizationTypesUrl}/${type.type}`;
       return this.http.put<OrganizationType>(url, type, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Eliminar un tipo de organización por tipo
     deleteOrganizationType(type: string): Observable<{}> {
       const url = `${this.organizationTypesUrl}/${type}`;
       return this.http.delete(url, this.httpOptions).pipe(
         catchError(this.handleError)
       );
     }

     // Manejo de errores
     private handleError(error: HttpErrorResponse) {
       let errorMessage = '';
       if (error.error instanceof ErrorEvent) {
         // Error del lado del cliente o de la red
         errorMessage = `Error: ${error.error.message}`;
       } else {
         // Error del lado del servidor
         errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
       }
       console.error(errorMessage);
       return throwError(errorMessage);
     }
   }