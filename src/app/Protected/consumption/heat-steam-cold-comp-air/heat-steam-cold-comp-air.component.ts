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
      //calculationYear: [{ value: this.activityYear, disabled: true }], // Año de cálculo (campo deshabilitado)
      //productionCenter: [{ value: this.productionCenter, disabled: true }], // Centro de producción (campo deshabilitado)
      energyType: ['', [Validators.required]], // Tipo de energía
      consumption: ['', [Validators.required]], // Consumo (kWh)
      emissionFactor: [{ value: 1, disabled: true }], // Factor de emisión (kg CO2e/kWh)
      emissions: [{ value: '', disabled: true }] // Emisiones calculadas (campo deshabilitado)
    });
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

  // Método para manejar el envío del formulario
  onSubmit(): void {
    console.log(this.heatSteamColdAirForm.value); // Imprime los valores del formulario en la consola
  }
}
