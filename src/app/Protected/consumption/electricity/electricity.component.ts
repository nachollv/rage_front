import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';

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
  
    constructor(private fb: FormBuilder, public dialog: MatDialog) {
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
  
