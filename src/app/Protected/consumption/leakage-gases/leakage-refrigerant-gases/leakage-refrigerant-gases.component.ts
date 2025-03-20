import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeakrefrigerantgasesService } from '../../../../services/leakrefrigerantgases.service';

@Component({
  selector: 'app-leakage-refrigerant-gases',
  templateUrl: './leakage-refrigerant-gases.component.html',
  styleUrl: './leakage-refrigerant-gases.component.scss'
})
export class LeakageRefrigerantGasesComponent {

  emisionesForm: FormGroup;
  gasTypes: any[] = []

  constructor(private fb: FormBuilder, private leakGases: LeakrefrigerantgasesService) {
    this.emisionesForm = this.fb.group({
      year: [{ value: '2023', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      building: [{ value: '', disabled: true }, Validators.required], // Campo obligatorio
      gasMezcla: ['', Validators.required],
      formulaQuimica: ['', Validators.required],
      pca: [null, Validators.required],
      otrasMezclas: [''],
      tipoEquipo: ['', Validators.required],
      capacidadEquipo: [null, [Validators.required, Validators.min(0)]],
      recargaEquipo: [null, [Validators.min(0)]],
      emisionesCO2e: [{ value: 0, disabled: true }] // Campo deshabilitado, por ejemplo
    });
    this.getGases()
  }

  getGases() {
    this.leakGases.getAll()
      .subscribe((gases:any) => {
      this.gasTypes = gases
      })
  }

  setEmissionFactors() {
    const gasData = this.emisionesForm.value
    const gasType = gasData.gasType
    const chemicalFormula = parseFloat(gasType.FormulaQuimica).toFixed(3);
    const pca6AR = parseFloat(gasType.PCA_6AR).toFixed(3);
   
    this.emisionesForm.get('formulaQuimica')?.setValue(chemicalFormula);
    this.emisionesForm.get('pca')?.setValue(pca6AR);
   
    this.emisionesForm.get('co2')?.setValue(gasData.quantity *  parseFloat(chemicalFormula));
    this.emisionesForm.get('ch4')?.setValue(gasData.quantity * parseFloat(pca6AR));

    this.emisionesForm.get('totalEmissions')?.setValue(gasData.quantity * parseFloat(chemicalFormula)+gasData.quantity * parseFloat(pca6AR))
  }

  onSubmit(): void {
    if (this.emisionesForm.valid) {
      console.log('Formulario enviado:', this.emisionesForm.value);
    } else {
      console.error('Formulario no válido');
    }
  }
}

