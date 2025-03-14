import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-organ-general-data',
  templateUrl: './organ-general-data.component.html',
  styleUrl: './organ-general-data.component.scss'
})
export class OrganGeneralDataComponent {
  mustShowDelegations: boolean = false
  displayedColumns: string[] = ['delegation', 'town', 'address', 'phone', 'edit', 'delete']
  data = [
    { delegation: 'Central', town: 'Palma', address: '123 Main St', phone: '971971971', edit: true, delete: true},
    { delegation: 'Sede Felanitx', town: 'Felanitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Manacor', town: 'Manacor', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true },  
    { delegation: 'Sede Calvià', town: 'Calvià', address: '123 Main St', phone: '971971971', edit: false, delete: true },
    { delegation: 'Sede Andraitx', town: 'Andraitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Pollença', town: 'Pollença', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  organizationForm: FormGroup
    organizationTypes: string[] = [
      'Micro',
      'Pequeña',
      'Mediana',
      'Gran empresa',
      'Administración',
      'Entidad sin ánimo de lucro',
      'Otras'
    ];
  
    sectors: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    periodList: string[] = ['2021', '2022', '2023', '2024', '2025'];
    objectiveList: string[] = ['Reducción del consumo de energía', 'Minimizar residuos', 'Ahorro de agua', 'Disminución de Emisiones de CO2', 'Aumento del uso de energías renovables'];

  
    constructor(private fb: FormBuilder, public dialog: MatDialog) {
      this.organizationForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(9)]],
        nif:  ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        organizationType: ['',],
        sector: ['',],
        multicenter: [false, [Validators.required]],
        operationalLimits: ['', [Validators.required]],
        calculationPeriod: ['', [Validators.required]],
        objectives: ['', [Validators.required]],
      });
    }
  
    onSubmit() {
      this.organizationForm.patchValue({
        multicenter: false
      });
      if (this.organizationForm.valid) {
        console.log(this.organizationForm.value);
      }
    }

    onSelectionChange(event: any) {
      const selectedValue = event.checked;
      this.mustShowDelegations = selectedValue;
      console.log('Selected value:', selectedValue);
    }
  

    openDialog(title:string, info:string): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: title,
          text: info,
          position: 'center'
        },
        width: '400px',
        height: '300px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El dialog se cerró');
      });
    }
  }