import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-heat-steam-cold-comp-air',
  templateUrl: './heat-steam-cold-comp-air.component.html',
  styleUrl: './heat-steam-cold-comp-air.component.scss'
})
export class HeatSteamColdCompAirComponent {
  energyForm: FormGroup;

    constructor(private fb: FormBuilder) {
      this.energyForm = this.fb.group({
        rows: this.fb.array([this.createRow()]),
      });
    }
  
    createRow(): FormGroup {
      return this.fb.group({
        calculationYear: [{ value: '2023', disabled: true }],
        productionCenter: [{value: '2', disabled: true}],
        energyType: [''], // Tipo de energía adquirida
        consumption: [''], // Dato de consumo (kWh)
        emissionFactor: [''], // Factor emisión (kg CO2e/kWh)
        emissions: [{ value: '', disabled: true }], // Emisiones (kg CO2e), solo lectura
      });
    }
  
    get rows(): FormArray {
      return this.energyForm.get('rows') as FormArray;
    }
  
    addRow(): void {
      this.rows.push(this.createRow());
    }
  
    calculateEmissions(index: number): void {
      const row = this.rows.at(index);
      const consumption = row.get('consumption')?.value;
      const emissionFactor = row.get('emissionFactor')?.value;
      const emissions = consumption * emissionFactor;
      row.get('emissions')?.setValue(emissions.toFixed(2));
    }
  
    onSubmit(): void {
      console.log(this.energyForm.value);
    }
  }
  