import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EmisionesElectricasEdificiosService } from '../../../services/emisiones-electricas-edificios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeTwoRecordsService } from '../../../services/scope-two-records.service';
import { MesesService } from '../../../services/meses.service';

@Component({
  selector: 'app-electricity',
  templateUrl: './electricity.component.html',
  styleUrl: './electricity.component.scss'
})
export class ElectricityComponent implements OnInit, OnChanges {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  comercializadorasElectricas: any[] = []
  errorMessage: string = ''

  displayedColumns: string[] = ['activity Year', 'Period', 'electricity Trading Company', 'activity Data', 'gdo', 'total Emissions', 'updated_at', 'delete']
  data = [ { } ];
  dataSource = new MatTableDataSource<any>(this.data)
  buildingElecConsumption!: FormGroup;
  
    constructor(private fb: FormBuilder, 
      private emisionesElectricasservice: EmisionesElectricasEdificiosService,
      private scopeTwoRecordsService: ScopeTwoRecordsService,
      private mesesService: MesesService,
      private snackBar: MatSnackBar,
      public dialog: MatDialog) {
    }

    ngOnInit(): void {
      this.buildingElecConsumption = this.fb.group({
        periodoFactura: ['', Validators.required],
        consumos: this.fb.group({
        comercializadora: ['', [Validators.required]],
        fe_co2: [{ value: null, disabled: true }],
        activityData: [[Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
        factorMixElectrico : [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
        gdo: ['', [Validators.required]]
        }),
        emisionesCO2e: [{ value: 0, disabled: true }] 
      });
      this.getAllEmissionsbyYear(this.activityYear)
      this.getScopeTwoRecords()
      this.dataSource = new MatTableDataSource<any>(this.data)
      this.setupListeners()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['activityYear'] && !changes['activityYear'].firstChange) {
        this.getAllEmissionsbyYear(this.activityYear);
      }
    }

    getScopeTwoRecords(activityYear: number = this.activityYear, productionCenter: number = this.productionCenter, activityType: string = 'electricityBuildings'): void {
      this.scopeTwoRecordsService.getRecordsByFilters(activityYear, productionCenter, activityType)
        .subscribe({
          next: (registros: any) => {
            this.emisionesElectricasservice.getByYear(activityYear)
              .subscribe((comercializadora:any) => {
                this.comercializadorasElectricas = comercializadora
                const meses = this.mesesService.getMeses();
                registros.data.forEach((registro: any) => {
                  registro.delete = true
                  const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                  registro.periodoFactura = resultado?.value   || 'desconocido';
                  registro['activity Year'] = registro.year
                  registro['Period'] = registro.periodoFactura
                  const matchedComercializadora = this.comercializadorasElectricas.find((comercializadoraItem: any) => comercializadoraItem.id === registro.electricityTradingCompany);
                  const activityData =  registro.activityData || 0;
                  const factorMixElectrico = matchedComercializadora.kg_CO2_kWh || 0;
                  const fe_co2 = +factorMixElectrico === 0.302 ? 1.0 : registro.gdo || 0;
                  const emisionesCO2e = (activityData * factorMixElectrico * fe_co2) / 1000;

                  registro.electricityTradingCompany = matchedComercializadora?.nombreComercial+" (fe:"+matchedComercializadora?.kg_CO2_kWh+")" || 'desconocido';
                  registro['electricity Trading Company'] = registro.electricityTradingCompany
                  registro['activity Data'] = registro.activityData + " kWh"
                  registro['total Emissions'] = "<strong><span ngClass='co2eqData'>"+ emisionesCO2e.toFixed(3) + " (tnCO2eq)</span></strong>"
                })

              })
            this.dataSource = new MatTableDataSource(registros.data)
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
          }
        });
    }

    getAllEmissionsbyYear(year:number): void {
      this.emisionesElectricasservice.getByYear(year).subscribe({
        next: (data) => {
          this.comercializadorasElectricas = data;
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.error('Error al obtener las emisiones:', error);
        }
      });
    }

    onComercializadoraChange(comercializadora: any): void {
      const consumosGroup = this.buildingElecConsumption.get('consumos') as FormGroup;
      if (consumosGroup) {
        consumosGroup.get('fe_co2')?.setValue(comercializadora.kg_CO2_kWh);
      }
    }

    onGdoChange(value: string): void {
      const consumosGroup = this.buildingElecConsumption.get('consumos') as FormGroup;
      if (consumosGroup) {
        consumosGroup.get('factorMixElectrico')?.setValue(value);
      }
    } 

    setupListeners(): void {
        const consumosGroup = this.buildingElecConsumption.get('consumos') as FormGroup;
      
        if (consumosGroup) {
          // Función para calcular emisiones
          const calculateEmisionesCO2e = () => {
            const activityData = consumosGroup.get('activityData')?.value || 0;
            const factorMixElectrico = consumosGroup.get('factorMixElectrico')?.value || 0;
            const fe_co2 = +factorMixElectrico === 0.302 ? 1.0 : consumosGroup.get('fe_co2')?.value || 0;
            const emisionesCO2e = (activityData * factorMixElectrico * fe_co2) / 1000;
            this.buildingElecConsumption.get('emisionesCO2e')?.setValue(emisionesCO2e.toFixed(3));
          };
      
          // Observadores para recalcular emisiones al cambiar cualquier campo relevante
          const relevantFields = ['activityData', 'comercializadora', 'gdo', 'factorMixElectrico', 'fe_co2'];
      
          relevantFields.forEach((fieldName) => {
            consumosGroup.get(fieldName)?.valueChanges.subscribe({
              next: () => calculateEmisionesCO2e(),
              error: (err) => console.error(`Error en el campo ${fieldName}:`, err),
            });
          });
        }
    }
      
    onSubmit() {
        const formValue = this.buildingElecConsumption.value
        formValue.year = this.activityYear
        formValue.productionCenter = this.productionCenter
        formValue.activityType = 'electricityBuildings' // Tipo de actividad
        this.buildingElecConsumption.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación

        this.scopeTwoRecordsService.createConsumption(this.buildingElecConsumption.value).subscribe({
          next: (response) => { 
            this.showSnackBar(response.message); // Imprime la respuesta del servidor
            this.getScopeTwoRecords(); // Actualiza la tabla después de crear un nuevo registro
            this.dataSource.data.push(response); // Agrega el nuevo registro a la tabla
            this.dataSource._updateChangeSubscription(); // Actualiza la fuente de datos de la tabla
            this.buildingElecConsumption.reset(); // Resetea el formulario después de enviar
          },
          error: (error) => {   
            this.showSnackBar(error.message); // Manejo de errores
          }
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            title: 'Título del Dialog',
            text: 'Este es el texto del Dialog.',
            position: 'center'
          },
          /* position: { top: '20%', left: '20%' } ,*/ // Ajusta la posición según tus necesidades
          width: '400px',
          height: '300px'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('El dialog se cerró');
        });
    }

    private showSnackBar(msg: string): void {
      this.snackBar.open(msg, 'Close', {
        duration: 15000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }
  
