import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-heat-steam-cold-comp-air',
  templateUrl: './heat-steam-cold-comp-air.component.html',
  styleUrls: ['./heat-steam-cold-comp-air.component.scss']
})
export class HeatSteamColdCompAirComponent {
  energyForm: FormGroup;
  showField: boolean = false
  
  constructor(private fb: FormBuilder) {
    // Estructura del formulario reactivo
    this.energyForm = this.fb.group({
      calculationYear: [{ value: '2023', disabled: true }], // Año de cálculo (campo deshabilitado)
      productionCenter: [{ value: '2', disabled: true }], // Centro de producción (campo deshabilitado)
      energyType: [''], // Tipo de energía
      consumption: [''], // Consumo (kWh)
      emissionFactor: [''], // Factor de emisión (kg CO2e/kWh)
      emissions: [{ value: '', disabled: true }] // Emisiones calculadas (campo deshabilitado)
    });
  }

  // Método para calcular emisiones
  calculateEmissions(): void {
    const consumption = this.energyForm.get('consumption')?.value; // Consumo ingresado
    const emissionFactor = this.energyForm.get('emissionFactor')?.value; // Factor de emisión ingresado

    if (consumption && emissionFactor) {
      const emissions = consumption * emissionFactor; // Cálculo de emisiones
      this.energyForm.get('emissions')?.setValue(emissions.toFixed(2)); // Actualización del campo "emisiones"
    } else {
      this.energyForm.get('emissions')?.setValue(''); // Resetea el valor si no hay datos válidos
    }
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    console.log(this.energyForm.value); // Imprime los valores del formulario en la consola
  }
}
