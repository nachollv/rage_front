import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';

@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})
export class FixedInstallationComponent {
    fuelForm: FormGroup;
    /* 'kg CO2/ud', 'g CH4/ud', 'g N2O/ud', 'kg CO2/ud', 'g CH4/ud', 'g N2O/ud', 'kg CO2', 'g CH4', 'g N2O', 'Emisiones Totales (kg CO2e)' */
    data = [
      { delegation: 'Central', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Felanitx', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Manacor', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},  
      { delegation: 'Calvià', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Andraitx', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Pollença', year: 2024, 'kg CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': '23.54', 'kg CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg CO2e)':154.24, edit: true, delete: true},
    ];
    constructor(private fb: FormBuilder, public dialog: MatDialog) {
      this.fuelForm = this.fb.group({
        building: ['', Validators.required],
        fuelType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        defaultFactor: this.fb.group({
          co2: [0, Validators.required],
          ch4: [0, Validators.required],
          n2o: [0, Validators.required]
        }),
        otherFactor: this.fb.group({
          co2: [0],
          ch4: [0],
          n2o: [0]
        }),
        partialEmissions: this.fb.group({
          co2: [{ value: 0, disabled: true }],
          ch4: [{ value: 0, disabled: true }],
          n2o: [{ value: 0, disabled: true }]
        }),
        totalEmissions: [{ value: 0, disabled: true }]
      });
    }
  
    calculateEmissions() {
      const quantity = this.fuelForm.get('quantity')?.value;
      const defaultFactor = this.fuelForm.get('defaultFactor')?.value;
      const otherFactor = this.fuelForm.get('otherFactor')?.value;
  
      const co2 = quantity * (otherFactor.co2 || defaultFactor.co2);
      const ch4 = quantity * (otherFactor.ch4 || defaultFactor.ch4);
      const n2o = quantity * (otherFactor.n2o || defaultFactor.n2o);
  
      this.fuelForm.get('partialEmissions.co2')?.setValue(co2);
      this.fuelForm.get('partialEmissions.ch4')?.setValue(ch4);
      this.fuelForm.get('partialEmissions.n2o')?.setValue(n2o);
  
      const totalEmissions = co2 + ch4 + n2o;
      this.fuelForm.get('totalEmissions')?.setValue(totalEmissions);
    }
  
    onSubmit() {
      if (this.fuelForm.valid) {
        console.log('Formulario válido', this.fuelForm.value);
      } else {
        console.log('Formulario no válido');
      }
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Título del Dialog',
          text: 'Este es el texto del Dialog.',
          position: 'center'
        },
        /* position: { top: '20%', left: '20%' } ,*/ // Ajusta la posición según tus necesidades
        width: '400px',
        height: '300px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El dialog se cerró');
      });
    }
  }