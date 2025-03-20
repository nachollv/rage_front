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
      building: [{ value: '', disabled: true }, Validators.required],
      gasMezcla: ['', Validators.required],
      formulaQuimica: [{ value: '', disabled: true }, Validators.required],
      pca: [{ value: '', disabled: true }, Validators.required],
      capacidadEquipo: [null, [Validators.required, Validators.min(0)]],
      recargaEquipo: [null, [Validators.required, Validators.min(0)]],
      emisionesCO2e: [{ value: 0, disabled: true }]
    });
    this.getGases()
  }

  getGases() {
    this.leakGases.getAll()
      .subscribe((gases:any) => {
      this.gasTypes = gases
      })
  }

  setPCAAndChemicalFormula() {
    const gasData = this.emisionesForm.value
    const gasType = gasData.gasMezcla
    const chemicalFormula = gasType.FormulaQuimica;
    const pca6AR = parseFloat(gasType.PCA_6AR).toFixed(3);
    const equipmentRecharge = gasData.recargaEquipo
    this.emisionesForm.get('formulaQuimica')?.setValue(chemicalFormula);
    this.emisionesForm.get('pca')?.setValue(pca6AR);
    if (equipmentRecharge) {
      this.emisionesForm.get('emisionesCO2e')?.setValue(equipmentRecharge * parseFloat(chemicalFormula)+equipmentRecharge * parseFloat(pca6AR))
    }
  }


  equipmentRecharge() {
    const gasData = this.emisionesForm.value
    const equipmentCapacity = gasData.capacidadEquipo
    const equipmentRecharge = gasData.recargaEquipo
    const pca6AR = gasData.gasMezcla.PCA_6AR
    // Convertir ambos valores a números
    const recharge = parseFloat(equipmentRecharge).toFixed(2);
    const capacity = parseFloat(equipmentCapacity).toFixed(2);
    if (recharge > capacity) {
      alert("La recarga no puede ser mayor que la capacidad");
      this.emisionesForm.get('recargaEquipo')?.setValue(0);
      return
    }
    this.emisionesForm.get('emisionesCO2e')?.setValue(parseFloat(recharge) * parseFloat(parseFloat(pca6AR).toFixed(2)))
  }

  onSubmit(): void {
    if (this.emisionesForm.valid) {
      console.log('Formulario enviado:', this.emisionesForm.value);
    } else {
      console.error('Formulario no válido');
    }
  }
}

