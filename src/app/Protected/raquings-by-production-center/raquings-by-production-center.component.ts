import { Component, Input , OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { RanquingCalculationService } from '../../services/ranquing-calculation.service';
import { tap } from 'rxjs';

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
  @Input() activityYear: number = 2022
  @Input() productionCenterID!: number
  totales: any[] = [];
  productionCenterData: any[] = []
  displayedColumns: string[] = ['activityYear', 'productionCenter', 'totalRecords'];
  constructor ( private ranquingCalculation: RanquingCalculationService,
                private productionCenterService: ProductioncenterService
   ) 
  {
   /*  this.getRanquings(this.activityYear, this.productionCenterID) */
   this.getProductionCenterData(this.productionCenterID)
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  
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
                totalRecords: 0
              }
            ];
    
            this.getRanquings(this.activityYear, prodCenter).subscribe(
              (totals: any[]) => {
                // Actualizamos el total si existen datos reales
                totals.forEach((record: any) => {
                  const index = this.totales.findIndex(
                    (t) => t.productionCenter === record.productionCenter
                  );
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
        this.productionCenterService.getAllCentrosDeProduccion().subscribe(
          (prodCenters: any[]) => {
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
    
    getRanquings(year: number, prodCenter: any) {
      return this.ranquingCalculation.getTotalizedRecordsByFilters(year, prodCenter.id).pipe(
        tap((response: any) => {
          if (!response.data || response.data.length === 0) {
            // Si no hay datos, retornamos un registro vacío para este centro
            response.data = [
              {
                total_records: 0, // Total 0 para centros sin registros
                productionCenterID: prodCenter.id,
                productionCenter: prodCenter.nombre,
                activityYear: year
              }
            ];
          }
          return response.data;
        })
      );
    }
    
  
    
}
