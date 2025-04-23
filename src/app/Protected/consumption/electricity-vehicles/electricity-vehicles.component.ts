import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-electricity-vehicles',
  templateUrl: './electricity-vehicles.component.html',
  styleUrl: './electricity-vehicles.component.scss'
})
export class ElectricityVehiclesComponent {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  vehiclesElectricity: FormGroup;
  showField: boolean = false
  
    constructor(private fb: FormBuilder, public dialog: MatDialog) {

    this.vehiclesElectricity = this.fb.group({
        activityYear: [{ value: this.activityYear, disabled: true }],
        productionCenter: [{ value: this.productionCenter, disabled: true }],
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
    if (this.vehiclesElectricity.valid) {
      console.log('Formulario válido:', this.vehiclesElectricity.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
