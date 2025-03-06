import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-electricity',
  templateUrl: './electricity.component.html',
  styleUrl: './electricity.component.scss'
})
export class ElectricityComponent {
  data = [
    { delegation: 'Central', year: 2024,  quantity: '123', CO2eq: '23.54', periode: 'enero', edit: true, delete: true},
    { delegation: 'Felanitx', year: 2024,  quantity: '456', CO2eq: '23.54', periode: 'febrero', edit: true, delete: true },
    { delegation: 'Manacor', year: 2024,  quantity: '789', CO2eq: '23.54', periode: 'marzo', edit: true, delete: true },  
    { delegation: 'Calvià', year: 2024,  quantity: '123', CO2eq: '23.54', periode: 'abril', edit: false, delete: true },
    { delegation: 'Andraitx', year: 2024,  quantity: '456', CO2eq: '23.54', periode: 'mayo', edit: true, delete: true },
    { delegation: 'Pollença', year: 2024,  quantity: '789', CO2eq: '23.54', periode: 'junio', edit: true, delete: true }
  ];
    consumoForm: FormGroup;
  
    constructor(private fb: FormBuilder) {
      this.consumoForm = this.fb.group({
        delegacion: ['', Validators.required],
        tipoFactura: ['mensual', Validators.required],
        consumos: this.fb.group({
          energia: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
          costo: ['', [Validators.required, Validators.pattern(/^[0-9]*(\.[0-9]{1,2})?$/)]]
        })
      });
    }
  
    onSubmit() {
      if (this.consumoForm.valid) {
        console.log(this.consumoForm.value);
      }
    }
  }
  
