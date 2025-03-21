import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-electricity-consumption-vehicles',
  templateUrl: './electricity-consumption-vehicles.component.html',
  styleUrl: './electricity-consumption-vehicles.component.scss'
})
export class ElectricityConsumptionVehiclesComponent {
  emisionesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emisionesForm = this.fb.group({
      registros: this.fb.array([])
    });

    // Inicialización de ejemplo
    this.addRegistro({
      edificio: 'Edificio Principal',
      comercializadora: 'ACCIONA GREEN ENERGY DEVELOPMENTS SL',
      garantiaOrigen: 'Sí',
      consumo: 50,
      factorMixElectrico: 0.302,
      emisiones: 15.10
    });
  }

  ngOnInit(): void {}

  // Método para obtener el FormArray
  get registros(): FormArray {
    return this.emisionesForm.get('registros') as FormArray;
  }

  // Método para añadir un nuevo registro al formulario
  addRegistro(data: any) {
    const registroGroup = this.fb.group({
      edificio: [data.edificio, Validators.required],
      comercializadora: [data.comercializadora, Validators.required],
      garantiaOrigen: [data.garantiaOrigen, Validators.required],
      consumo: [data.consumo, [Validators.required, Validators.min(0)]],
      factorMixElectrico: [data.factorMixElectrico, [Validators.required, Validators.min(0)]],
      emisiones: [data.emisiones, [Validators.required, Validators.min(0)]]
    });

    this.registros.push(registroGroup);
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.emisionesForm.valid) {
      console.log('Formulario válido:', this.emisionesForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
