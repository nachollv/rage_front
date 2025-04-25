import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../../dialog/dialog.component';
import { ScopeTwoRecordsService } from '../../../services/scope-two-records.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmisionesElectricasEdificiosService } from '../../../services/emisiones-electricas-edificios.service';

@Component({
  selector: 'app-heat-steam-cold-comp-air',
  templateUrl: './heat-steam-cold-comp-air.component.html',
  styleUrls: ['./heat-steam-cold-comp-air.component.scss']
})
export class HeatSteamColdCompAirComponent {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  displayedColumns: string[] = ['year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'delete']
  data = [
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true},
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },  
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: false, delete: true },
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  heatSteamColdAirForm!: FormGroup;

  constructor(private fb: FormBuilder, 
    private snackBar: MatSnackBar,
     private emisionesElectricasservice: EmisionesElectricasEdificiosService,
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
      //this.getAllEmisionesbyYear(this.activityYear);
    }
  }

  getScopeTwoRecords() {
    this.scopeTWoRecordsService.getRecordsByFilters(this.activityYear, this.productionCenter, 'heatSteamColdAir').subscribe({
      next: (data) => {
        console.log('Datos obtenidos:', data); // Imprime los datos obtenidos
        this.dataSource.data = data; // Asigna los datos a la fuente de datos de la tabla
      },
      error: (error) => {
        console.error('Error al obtener los registros:', error); // Manejo de errores
      }
    });
  }
  // Método para calcular emisiones
  calculateEmissions(): void {
    const consumption = this.heatSteamColdAirForm.get('consumption')?.value; // Consumo ingresado
    console.log('Consumo:', consumption); // Imprime el consumo ingresado
    const emissionFactor = this.heatSteamColdAirForm.get('emissionFactor')?.value; // Factor de emisión ingresado

    if (consumption && emissionFactor) {
      const emissions = consumption * emissionFactor; // Cálculo de emisiones
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
    formValue.electricityTradingCompany = 0 // No hay comercializadora para este formulario
    formValue.gdo = 0.00 // No hay GDO para este formulario
    this.heatSteamColdAirForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
    this.scopeTWoRecordsService.createConsumption(this.heatSteamColdAirForm.value).subscribe({
      next: (response) => { 
        this.showSnackBar('Registro creado:'+ response); // Imprime la respuesta del servidor
        this.getScopeTwoRecords(); // Actualiza la tabla después de crear un nuevo registro
      },
      error: (error) => {   
        this.showSnackBar('Error al crear el registro: '+ error); // Manejo de errores
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
