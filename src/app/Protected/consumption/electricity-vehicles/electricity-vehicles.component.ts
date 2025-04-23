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
  displayedColumns: string[] = ['year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'delete']
  data = [
    { delegation: 'Central', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: true, delete: true},
    { delegation: 'Felanitx', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: true, delete: true },
    { delegation: 'Manacor', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: true, delete: true },  
    { delegation: 'Calvià', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: false, delete: true },
    { delegation: 'Andraitx', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: true, delete: true },
    { delegation: 'Pollença', year: 2022, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, '12': 45.345, edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  vehiclesElectricity: FormGroup;

  
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
