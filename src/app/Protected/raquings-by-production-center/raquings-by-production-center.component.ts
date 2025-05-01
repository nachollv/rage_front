import { Component, Input , OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { RanquingCalculationService } from '../../services/ranquing-calculation.service';
import { tap } from 'rxjs';

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
        // Si se proporciona productionCenterID, obtener el centro de producción específico
        this.productionCenterService.getCentroDeProduccionByID(productionCenterID)
          .subscribe((prodCenter: any) => {
            this.productionCenterData = prodCenter;
            this.getRanquings(this.activityYear, productionCenterID);
          }, error => {
            console.error('Error al obtener el Centro de Producción:', error);
          });
      } else {
        // Si no se proporciona productionCenterID, obtener todos los centros de producción
        this.productionCenterService.getAllCentrosDeProduccion()
          .subscribe((prodCenters: any[]) => {
            console.log ("prodCenter", prodCenters)
            // Inicializar el array totales si no existe
            if (!this.totales) {
              this.totales = [];
            }
    
            // Llamar a getRanquings para cada centro de producción
            prodCenters.forEach((center: any) => {
              this.getRanquings(this.activityYear, center).subscribe((totals: any[]) => {
                // Acumular los resultados en totales[]
                this.totales = [...this.totales, ...totals];
                console.log('Totales acumulados:', this.totales);
              }, error => {
                console.error('Error al procesar el Centro de Producción:', center, error);
              });
            });
          }, error => {
            console.error('Error al obtener los Centros de Producción:', error);
          });
      }
    }
    

    getRanquings(year: number, prodCenter: any) {
      return this.ranquingCalculation.getTotalizedRecordsByFilters(year, prodCenter.id)
        .pipe(
          tap((totals: any) => {
            const mappedRecords = totals.data.map((record: any) => {
              record.productionCenter = prodCenter.nombre;
              return record;
            });
    
            // Acumular los registros en lugar de sobrescribir
            this.totales = this.totales ? [...this.totales, ...mappedRecords] : mappedRecords;
          })
        );
    }
    
}
