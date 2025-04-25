import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EmisionesElectricasEdificiosService } from '../../../services/emisiones-electricas-edificios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  displayedColumns: string[] = ['year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'delete']
  data = [
    { delegation: 'Central', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true},
    { delegation: 'Felanitx', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { delegation: 'Manacor', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },  
    { delegation: 'Calvià', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: false, delete: true },
    { delegation: 'Andraitx', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { delegation: 'Pollença', year: 2023, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  buildingElecConsumption!: FormGroup;
  
    constructor(private fb: FormBuilder, 
      private emisionesElectricasservice: EmisionesElectricasEdificiosService,
      public dialog: MatDialog) {
    }

    ngOnInit(): void {
      this.buildingElecConsumption = this.fb.group({
        periodoFactura: ['', Validators.required],
        consumos: this.fb.group({
          comercializadora: ['', [Validators.required]],
          fe_co2: [{ value: null, disabled: true }],
          activityData: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
          factorMixElectrico : [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
          gdo: ['', [Validators.required]]
        }),
        activityType: ['electricity'],
        emisionesCO2e: [{ value: 0, disabled: true }] 
      });
      this.getAllEmissionsbyYear(this.activityYear)
      this.setupListeners()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['activityYear'] && !changes['activityYear'].firstChange) {
        this.getAllEmissionsbyYear(this.activityYear);
      }
    }

    getAllEmissionsbyYear(year:number): void {
      this.emisionesElectricasservice.getByYear(year).subscribe({
        next: (data) => {
          this.comercializadorasElectricas = data;
          console.log('Emisiones obtenidas:', this.comercializadorasElectricas);
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
      if (this.buildingElecConsumption.valid) {
        console.log(this.buildingElecConsumption.value);
      }
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
  }
  
