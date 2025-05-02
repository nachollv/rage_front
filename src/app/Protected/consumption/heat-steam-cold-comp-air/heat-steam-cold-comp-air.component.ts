import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../../dialog/dialog.component';
import { ScopeTwoRecordsService } from '../../../services/scope-two-records.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MesesService } from '../../../services/meses.service';
@Component({
  selector: 'app-heat-steam-cold-comp-air',
  templateUrl: './heat-steam-cold-comp-air.component.html',
  styleUrls: ['./heat-steam-cold-comp-air.component.scss']
})
export class HeatSteamColdCompAirComponent {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  displayedColumns: string[] = ['activity Year', 'Period', 'energy Type', 'activity Data', 'total Emissions', 'updated_at', 'delete']
  data = [{}];
  dataSource = new MatTableDataSource<any>(this.data)
  heatSteamColdAirForm!: FormGroup;

  constructor(private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private mesesService: MesesService,
    private scopeTWoRecordsService: ScopeTwoRecordsService) {

  }

  ngOnInit(): void {
    this.heatSteamColdAirForm = this.fb.group({
      periodoFactura: ['', Validators.required],
      consumos: this.fb.group({
      energyType: ['', [Validators.required]], // Tipo de energía
      activityData: ['', [Validators.required]], // Consumo (kWh)
      emissionFactor: [{ value: 1, disabled: true }], // Factor de emisión (kg CO2e/kWh)
      }),
      emisionesCO2e: [{ value: 0, disabled: true }] // Emisiones (kg CO2e)
    });
    this.setupListeners()
    this.getScopeTwoRecords()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeTwoRecords();
    }
  }

  getScopeTwoRecords() {
    const meses = this.mesesService.getMeses();
    this.scopeTWoRecordsService.getRecordsByFilters(this.activityYear, this.productionCenter, 'heatSteamColdAir')
    .subscribe({
      next: (data: any) => {
        data.data.forEach((record: any) => {
          record.periodoFactura = record.periodoFactura.split('T')[0]; // Formato de fecha
          record.updated_at = record.updated_at.split('T')[0]; // Formato de fecha
          record.activityData = record.activityData + " kWh" // Formato de número
          record.delete = true
          const resultado = meses.find((mes) => mes.key === record.periodoFactura);
          record.periodoFactura = resultado?.value   || 'desconocido';
          record['Period'] = record.periodoFactura
          record['activity Year'] = record.year
          record['energy Type'] = record.energyType
          record['activity Data'] = record.activityData || 0
          record['total Emissions'] = "<strong><span ngClass='co2eqData'>"+ (parseFloat(record.activityData)/1000) + " (tnCO2eq)</span></strong>"
        });
        this.dataSource = new MatTableDataSource(data.data) // Asigna los datos a la fuente de datos de la tabla
      },
      error: (error) => {
        console.error('Error al obtener los registros:', error); // Manejo de errores
      }
    });
  }
  // Método para calcular emisiones
  calculateEmissions(): void {
    const consumosGroup = this.heatSteamColdAirForm.get('consumos') as FormGroup;
    const activityData = consumosGroup.get('activityData')?.value; // activityData ingresado
    const emissionFactor = this.heatSteamColdAirForm.get('emissionFactor')?.value; // Factor de emisión ingresado

    if (activityData && emissionFactor) {
      const emissions = activityData * emissionFactor; // Cálculo de emisiones
      this.heatSteamColdAirForm.get('emissions')?.setValue(emissions.toFixed(2)); // Actualización del campo "emisiones"
    } else {
      this.heatSteamColdAirForm.get('emissions')?.setValue(''); // Resetea el valor si no hay datos válidos
    }
  }

  setupListeners(): void {
    const consumosGroup = this.heatSteamColdAirForm.get('consumos') as FormGroup;
  
    if (consumosGroup) {
      // Función para calcular emisiones
      const calculateEmisionesCO2e = () => {
        const activityData = consumosGroup.get('activityData')?.value || 0;
        const emissionFactor = consumosGroup.get('emissionFactor')?.value || 0;
        const emisionesCO2e = (activityData * emissionFactor) / 1000;
  
        this.heatSteamColdAirForm.get('emisionesCO2e')?.setValue(emisionesCO2e.toFixed(3));
      };
  
      // Observadores para recalcular emisiones al cambiar cualquier campo relevante
      const relevantFields = ['activityData', 'energyType'];
  
      relevantFields.forEach((fieldName) => {
        consumosGroup.get(fieldName)?.valueChanges.subscribe({
          next: () => calculateEmisionesCO2e(),
          error: (err) => console.error(`Error en el campo ${fieldName}:`, err),
        });
      });
    }
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    const formValue = this.heatSteamColdAirForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.activityType = 'heatSteamColdAir' // Tipo de actividad
    formValue.electricityTradingCompany = 0 // No hay comercializadora para este formulario
    formValue.gdo = 0.00 // No hay GDO para este formulario
    formValue.periodoFactura = formValue.periodoFactura // Asigna el periodo de factura
    this.heatSteamColdAirForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
    this.scopeTWoRecordsService.createConsumption(this.heatSteamColdAirForm.value).subscribe({
      next: (response) => { 
        this.showSnackBar(response.message); // Imprime la respuesta del servidor
        this.getScopeTwoRecords(); // Actualiza la tabla después de crear un nuevo registro
        this.dataSource.data.push(response); // Agrega el nuevo registro a la tabla
        this.dataSource._updateChangeSubscription(); // Actualiza la fuente de datos de la tabla
        this.heatSteamColdAirForm.reset(); // Resetea el formulario después de enviar
      },
      error: (error) => {   
        this.showSnackBar(error.messages); // Manejo de errores
      }
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
