import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent implements OnInit, OnChanges {

  emissionsForm!: FormGroup;
  showField: boolean = false
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void { 
    this.emissionsForm = this.fb.group({
      rows: this.fb.array([this.createRow()]), // Inicializa con una fila vacía
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      //this.getFuelConsumptions(+this.activityYear);
    }
  }
  createRow(): FormGroup {
    return this.fb.group({
      productionCenter: [{ value: '6', disabled: true }],
      machineryType: [''], // Tipo de maquinaria
      fuelType: [''], // Tipo de Combustible o lubricante
      quantity: [''], // Cantidad (ud)
      defaultEmissionFactor: this.fb.group({
        co2: [''], // kg CO₂/ud
        ch4: [''], // g CH₄/ud
        n2o: [''], // g N₂O/ud
      }),
      otherEmissionFactor: this.fb.group({
        co2: [''], // Otros: kg CO₂/ud
        ch4: [''], // Otros: g CH₄/ud
        n2o: [''], // Otros: g N₂O/ud
      }),
      partialEmissions: this.fb.group({
        co2: [{ value: '', disabled: true }], // Emisiones parciales C: kg CO₂
        ch4: [{ value: '', disabled: true }], // Emisiones parciales C: g CH₄
        n2o: [{ value: '', disabled: true }], // Emisiones parciales C: g N₂O
      }),
      totalEmissions: [{ value: '', disabled: true }], // Emisiones totales C: kg CO₂e
    });
  }

  get rows(): FormArray {
    return this.emissionsForm.get('rows') as FormArray;
  }

  addRow(): void {
    this.rows.push(this.createRow());
  }

  calculateEmissions(index: number): void {
    const row = this.rows.at(index);
    const quantity = row.get('quantity')?.value;
    const defaultFactors = row.get('defaultEmissionFactor')?.value;
    const partialEmissions = row.get('partialEmissions') as FormGroup;

    if (quantity && defaultFactors) {
      const co2 = quantity * defaultFactors.co2;
      const ch4 = quantity * defaultFactors.ch4;
      const n2o = quantity * defaultFactors.n2o;

      partialEmissions.get('co2')?.setValue(co2.toFixed(2));
      partialEmissions.get('ch4')?.setValue(ch4.toFixed(2));
      partialEmissions.get('n2o')?.setValue(n2o.toFixed(2));

      const total = co2 + ch4 / 1000 + n2o / 1000; // Conversión de CH₄ y N₂O a kg CO₂e
      row.get('totalEmissions')?.setValue(total.toFixed(2));
    } else {
      partialEmissions.reset();
      row.get('totalEmissions')?.setValue('');
    }
  }

  onSubmit(): void {
    console.log(this.emissionsForm.value);
  }
}
