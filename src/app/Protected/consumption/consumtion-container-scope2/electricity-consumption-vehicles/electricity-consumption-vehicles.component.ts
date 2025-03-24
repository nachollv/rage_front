import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-electricity-consumption-vehicles',
  templateUrl: './electricity-consumption-vehicles.component.html',
  styleUrl: './electricity-consumption-vehicles.component.scss'
})
export class ElectricityConsumptionVehiclesComponent {
  vehiclesElectricityConsumption: FormGroup;

    constructor(private fb: FormBuilder, public dialog: MatDialog) {

    this.vehiclesElectricityConsumption = this.fb.group({
        productionCenter: [{ value: 2, disabled: true }],
        activityYear: [{ value: 2025, disabled: true }],
        periodoFactura: ['', Validators.required],
        consumos: this.fb.group({
        comercializadora: ['', [Validators.required]],
        activityData: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
        gdo: ['', [Validators.required]]}),
        factorMixElectrico: [{ value: '', disabled: true }],
        emisionesCO2e: [{ value: 0, disabled: true }]
      });
  }
  
  // Método para enviar el formulario
  onSubmit() {
    if (this.vehiclesElectricityConsumption.valid) {
      console.log('Formulario válido:', this.vehiclesElectricityConsumption.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
