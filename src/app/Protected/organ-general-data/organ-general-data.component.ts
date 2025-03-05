import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-organ-general-data',
  templateUrl: './organ-general-data.component.html',
  styleUrl: './organ-general-data.component.scss'
})
export class OrganGeneralDataComponent {
  data = [
    { name: 'John', age: 25, address: '123 Main St' },
    { name: 'Jane', age: 30, address: '456 Maple Ave' },
    { name: 'Doe', age: 35, address: '789 Oak Dr' }
  ];
    organizationForm: FormGroup;
  
    organizationTypes = [
      'Micro',
      'Pequeña',
      'Mediana',
      'Gran empresa',
      'Administración',
      'Entidad sin ánimo de lucro',
      'Otras'
    ];
  
    sectors = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
    constructor(private fb: FormBuilder) {
      this.organizationForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(9)]],
        nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        organizationType: ['', [Validators.required]],
        sector: ['', [Validators.required]]
      });
    }
  
    onSubmit() {
      if (this.organizationForm.valid) {
        console.log(this.organizationForm.value);
      }
    }
  }