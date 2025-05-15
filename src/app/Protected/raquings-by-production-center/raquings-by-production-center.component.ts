import { Component, Input , OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { RanquingCalculationService } from '../../services/ranquing-calculation.service';
import { map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';

export type ApiResponse = {
  status: string;
  data: ProductionRecord[];
};

export type ProductionRecord = {
  activityYear: string;
  productionCenter: string;
  total_records: string;
};

@Component({
  selector: 'app-raquings-by-production-center',
  templateUrl: './raquings-by-production-center.component.html',
  styleUrl: './raquings-by-production-center.component.scss'
})
export class RaquingsByProductionCenterComponent implements OnInit, OnChanges {
  availableYears: number[] = [2019, 2020, 2021, 2022, 2023];
  @Input() activityYear: number = 2023
  @Input() productionCenterID!: number
  rol: string = ''
  organizationID!: number
  totales: any[] = [];
  productionCenterData: any[] = []
  displayedColumns: string[] = ['activityYear', 'productionCenter', 'totalRecords'];
  token: string = ''
  isExpiredToken: boolean = false

  constructor ( private ranquingCalculation: RanquingCalculationService,
                private productionCenterService: ProductioncenterService,
                private jwtHelper: JwtHelperService,
                private authService: AuthService,
                private router: Router, 
   ) 
  {
    
  }

  ngOnInit(): void {
    this.token = this.authService.getToken() || ''
    this.isExpiredToken = this.jwtHelper.isTokenExpired(this.token)
    if (this.isExpiredToken) {
      this.router.navigate(['/login'])
    }
    this.rol = this.jwtHelper.decodeToken(this.token).data['rol']
    this.organizationID = this.jwtHelper.decodeToken(this.token).data['id_empresa']
    if (this.rol === 'Admin') {

    } else  {
      this.productionCenterID = this.jwtHelper.decodeToken(this.token).data['id']
    }
    this.getProductionCenterData(this.productionCenterID)
  }

  ngOnChanges(changes: SimpleChanges): void { }
  
    getProductionCenterData(productionCenterID?: number) {
      if (productionCenterID) {
        this.productionCenterService.getCentroDeProduccionByID(productionCenterID).subscribe(
          (prodCenter: any) => {
            this.productionCenterData = [prodCenter];
            // Inicializar `totales` con este centro y totalRecords = 0
            this.totales = [
              {
                activityYear: this.activityYear,
                productionCenter: prodCenter.nombre,
                productionCenterID: prodCenter.id,
                totalRecords: 0
              }
            ];
            this.getRanquings(this.activityYear, prodCenter).subscribe(
              (totals: ApiResponse) => {
                // Actualizamos el total
                totals.data.forEach((record: any) => {
                  const index = this.totales.findIndex((t) => t.productionCenterID === record.productionCenter);
                  if (index !== -1) {
                    this.totales[index].totalRecords = record.total_records;
                  }
                });
                console.log('Totales actualizados:', this.totales);
              },
              (error) => {
                console.error('Error al obtener los totales:', error);
              }
            );
          },
          (error) => {
            console.error('Error al obtener el Centro de Producción:', error);
          }
        );
      } else {
        this.productionCenterService.getCentrosDeProduccionFromOrganizacion(this.organizationID).subscribe(
          (prodCenters: any) => {
            this.productionCenterData = prodCenters;
            // Inicializar los totales con valores de 0
            this.totales = prodCenters.map((center: any) => ({
              activityYear: this.activityYear,
              productionCenter: center.nombre,
              productionCenterID: center.id,
              totalRecords: 0
            }));
            // Procesar cada centro de producción
            prodCenters.forEach((center: any) => {
              this.getRanquings(this.activityYear, center).subscribe(
                (totals: ApiResponse) => {
                   totals.data.forEach((record: any) => {
                    const index = this.totales.findIndex((t) => t.productionCenterID === record.productionCenter);
                    if (index !== -1) {
                      this.totales[index].totalRecords = record.total_records;
                    }
                  }); 
                  
                  // Ordenar totales de mayor a menor por `totalRecords`
                  this.totales.sort((a, b) => parseInt(b.totalRecords, 10) - parseInt(a.totalRecords, 10));
                   // Agregar la etiqueta 'BEST' al primer elemento
                  if (this.totales.length > 0) {
                    this.totales[0].best = true;
                  }
                  console.log('Totales acumulados:', this.totales);
                },
                (error) => {
                  console.error('Error al procesar el Centro de Producción:', center, error);
                }
              );
            });
          },
          (error) => {
            console.error('Error al obtener los Centros de Producción:', error);
          }
        );
      }
    }
    
/* getRanquings(year: number, prodCenter: any) {
  return this.ranquingCalculation.getTotalizedRecordsByFiltersScopeOne(year, prodCenter.id).pipe(
    map((response: any) => {
      if (!response.data || response.data.length === 0) {
        response.data = [
          {
            total_records: 0, // Total 0 para centros sin registros
            productionCenterID: prodCenter.id,
            productionCenter: prodCenter.nombre,
            activityYear: year
          }
        ];
      }

      // Calculamos el total de registros
      response.totalRecords = response.data.reduce((sum: number, record: any) => sum + (record.total_records || 0), 0);
      return response;
    }),
    switchMap((scopeOneResponse: any) => this.ranquingCalculation.getTotalizedRecordsByFiltersScopeTwo(year, prodCenter.id).pipe(
      map((scopeTwoResponse: any) => {
        // Agregamos el total de registros de Scope Two
        scopeTwoResponse.totalRecords = scopeTwoResponse.data.reduce((sum: number, record: any) => sum + (record.total_records || 0), 0);
        scopeOneResponse.data[0].total_records = parseFloat(scopeOneResponse.data[0].total_records)+ parseFloat(scopeTwoResponse.data[0].total_records)
        return scopeOneResponse
      })
    ))
  );
} */


  getRanquings(year: number, prodCenter: any) {
  return this.ranquingCalculation.getTotalizedRecordsByFiltersScopeOne(year, prodCenter.id).pipe(
    map((scopeOneResponse: any) => {
      if (!scopeOneResponse.data || scopeOneResponse.data.length === 0) {
        // Si no hay datos, retornamos un registro vacío para este centro
        scopeOneResponse.data = [
          {
            total_records: 0, // Total 0 para centros sin registros
            productionCenterID: prodCenter.id,
            productionCenter: prodCenter.nombre,
            activityYear: year
          }
        ];
      }

      // Calculamos el total de registros de Scope One
      scopeOneResponse.totalRecords = scopeOneResponse.data.reduce((sum: number, record: any) => sum + (record.total_records || 0), 0);
      return scopeOneResponse;
    }),
    switchMap((scopeOneResponse: any) => this.ranquingCalculation.getTotalizedRecordsByFiltersScopeTwo(year, prodCenter.id).pipe(
      map((scopeTwoResponse: any) => {
        // Agregamos el total de registros de Scope Two
        scopeTwoResponse.totalRecords = scopeTwoResponse.data.reduce((sum: number, record: any) => sum + (record.total_records || 0), 0);

        // Sumamos los registros de Scope One y Scope Two
        scopeOneResponse.data[0].total_records = parseFloat(scopeOneResponse.data[0].total_records) + parseFloat(scopeTwoResponse.data[0].total_records);
        return { scopeOneResponse, scopeTwoResponse };
      })
    )),
    switchMap(({ scopeOneResponse, scopeTwoResponse }) => this.ranquingCalculation.getTotalizedRecordsByFiltersFugitiveEmissions(year, prodCenter.id).pipe(
      map((fugitiveEmissionsResponse: any) => {
        // Agregamos el total de registros de Fugitive Emissions
        fugitiveEmissionsResponse.totalRecords = fugitiveEmissionsResponse.data.reduce((sum: number, record: any) => sum + (record.total_records || 0), 0);
        // Sumamos todos los registros
        scopeOneResponse.data[0].total_records = parseFloat(scopeOneResponse.data[0].total_records)+ parseFloat(fugitiveEmissionsResponse.data[0].total_records)
        return scopeOneResponse
      })
    ))
  );
}


    filterByYear(year: number | 2023) {
      this.activityYear = +year;
      this.getProductionCenterData(this.productionCenterID)
    }
    
  
    
}
