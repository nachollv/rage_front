import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-organ-general-data',
  templateUrl: './organ-general-data.component.html',
  styleUrl: './organ-general-data.component.scss'
})
export class OrganGeneralDataComponent {
  data = [
    { delegation: 'Central', town: 'Palma', address: '123 Main St', phone: '971971971', edit: true, delete: true},
    { delegation: 'Sede Felanitx', town: 'Felanitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Manacor', town: 'Manacor', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true },  
    { delegation: 'Sede Calvià', town: 'Calvià', address: '123 Main St', phone: '971971971', edit: false, delete: true },
    { delegation: 'Sede Andraitx', town: 'Andraitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Pollença', town: 'Pollença', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true }
  ];
    organizationForm: FormGroup;
  
    organizationTypes = [
      'Micro',
      'Pequeña',
      'Mediana',
      'Gran empresa',
      'Administración',
      'Entidad sin ánimo de lucro',
      'Otras'
    ];
  
    sectors = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
    constructor(private fb: FormBuilder, public dialog: MatDialog) {
      this.organizationForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(9)]],
        nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        organizationType: ['', [Validators.required]],
        sector: ['', [Validators.required]]
      });
    }
  
    onSubmit() {
      if (this.organizationForm.valid) {
        console.log(this.organizationForm.value);
      }
    }

    openDialog(title:string, info:string): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: title,
          text: info,
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