import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

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
  heatSteamColdAirForm: FormGroup;

  
  constructor(private fb: FormBuilder) {
    // Estructura del formulario reactivo
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
  }

  // Método para calcular emisiones
  calculateEmissions(): void {
    const consumption = this.heatSteamColdAirForm.get('consumption')?.value; // Consumo ingresado
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
    console.log(this.heatSteamColdAirForm.value); // Imprime los valores del formulario en la consola
  }
}
