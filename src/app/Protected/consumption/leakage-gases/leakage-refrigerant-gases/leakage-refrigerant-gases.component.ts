import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leakage-refrigerant-gases',
  templateUrl: './leakage-refrigerant-gases.component.html',
  styleUrl: './leakage-refrigerant-gases.component.scss'
})
export class LeakageRefrigerantGasesComponent {

  emisionesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emisionesForm = this.fb.group({
      edificio: ['', Validators.required], // Campo obligatorio
      gasMezcla: ['', Validators.required],
      formulaQuimica: ['', Validators.required],
      pca: [null, Validators.required],
      otrasMezclas: [''],
      tipoEquipo: ['', Validators.required],
      capacidadEquipo: [null, [Validators.required, Validators.min(0)]],
      recargaEquipo: [null, [Validators.min(0)]],
      emisionesCO2e: [{ value: 0, disabled: true }] // Campo deshabilitado, por ejemplo
    });
  }

  onSubmit(): void {
    if (this.emisionesForm.valid) {
      console.log('Formulario enviado:', this.emisionesForm.value);
    } else {
      console.error('Formulario no válido');
    }
  }
}

