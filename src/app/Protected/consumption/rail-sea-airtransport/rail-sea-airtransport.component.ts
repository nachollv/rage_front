import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-rail-sea-airtransport',
  templateUrl: './rail-sea-airtransport.component.html',
  styleUrl: './rail-sea-airtransport.component.scss'
})
export class RailSeaAirtransportComponent implements OnInit {

  transportForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.transportForm = this.fb.group({
      activityYear: ['', Validators.required],
      productionCenter: ['', Validators.required],
      transportType: ['', Validators.required],
      fuelType: ['', Validators.required],
      fuelQuantity: ['', [Validators.required, Validators.min(0)]],
      defaultEmissionFactor: this.fb.group({
        co2: [0, Validators.required],
        ch4: [0, Validators.required],
        n2o: [0, Validators.required]
      }),
      partialEmissions: this.fb.group({
        co2: [0, Validators.required],
        ch4: [0, Validators.required],
        n2o: [0, Validators.required]
      }),
      totalEmissions: [0, Validators.required]
    });
  }
  get rows(): FormArray {
    return this.transportForm.get('rows') as FormArray;
  }

  calculateEmissions(): void {
    const formValue = this.transportForm.value
    const quantity = formValue.get('fuelQuantity')?.value;
    const defaultFactors = formValue.get('defaultEmissionFactor')?.value;
    const partialEmissions = formValue.get('partialEmissions') as FormGroup;

    if (quantity && defaultFactors) {
      const co2 = quantity * defaultFactors.co2;
      const ch4 = quantity * defaultFactors.ch4;
      const n2o = quantity * defaultFactors.n2o;

      partialEmissions.get('co2')?.setValue(co2.toFixed(2));
      partialEmissions.get('ch4')?.setValue(ch4.toFixed(2));
      partialEmissions.get('n2o')?.setValue(n2o.toFixed(2));

      const total = co2 + ch4 / 1000 + n2o / 1000; // Conversión de CH₄ y N₂O a kg CO₂e
      formValue.get('totalEmissions')?.setValue(total.toFixed(2));
    } else {
      partialEmissions.reset();
      formValue.get('totalEmissions')?.setValue('');
    }
  }

  onSubmit(): void {
    console.log(this.transportForm.value);
  }
}

