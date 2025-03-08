import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})
export class FixedInstallationComponent {
  displayedColumns: string[] = ['delegation', 'year', 'kg  CO2/ud-defecto', 'g CH4/ud-defecto', 'g N2O/ud-defecto', 'g  CO2/ud-otros', 'g CH4/ud-otros', 'g N2O/ud-otros', 'kg  CO2', 'g CH4', 'g N2O', 'Emisiones Totales (kg  CO2e)', 'edit', 'delete']
    data = [
      { delegation: 'Central', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Felanitx', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Manacor', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},  
      { delegation: 'Calvià', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Andraitx', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},
      { delegation: 'Pollença', year: 2024, 'kg  CO2/ud-defecto': 25, 'g CH4/ud-defecto': 34.25, 'g N2O/ud-defecto': 23.54, 'kg  CO2/ud-otros': 45.345, 'g CH4/ud-otros': 0.00, 'g N2O/ud-otros': 0.00, 'kg  CO2': 0.12, 'g CH4':12.23, 'g N2O': 25.21, 'Emisiones Totales (kg  CO2e)':154.24, edit: true, delete: true},
    ];
    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm: FormGroup;
    fuelTypes: string[] = ['Gasóleo C (l)', 'Gasóleo B (l)', 'Gas natural (kWhPCS)*', 
      'Fuelóleo (l)', 'LPG (l)', 'Queroseno (l)', 'Gas propano (kg)', 'Gas butano (kg)', 
      'Gas manufacturado (kg)', 'Biogás (kg)**', 'Biomasa madera (kg)**', 'Biomasa pellets (kg)**', 
      'Biomasa astillas (kg)**', 'Biomasa serrines virutas (kg)**', 'Biomasa cáscara f. secos (kg)**', 
      'Biomasa hueso aceituna (kg)**', 'Carbón vegetal (kg)**', 'Coque de petróleo (kg)', 'Coque de carbón (kg)', 
      'Hulla y antracita (kg)', 'Hullas subituminosas (kg)', 'Gasóleo A (l)', 'Gasolina  (l)'];
    
    constructor(private fb: FormBuilder, public dialog: MatDialog, private fuelDataService: FuelDataService) {
      this.fuelForm = this.fb.group({
        year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        building: ['', Validators.required],
        fuelType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        defaultFactor: this.fb.group({
          co2: [0, Validators.required],
          ch4: [0, Validators.required],
          n2o: [0, Validators.required]
        }),
        otherFactor: this.fb.group({
          co2: [{ value: 0, disabled: true }],
          ch4: [{ value: 0, disabled: true }],
          n2o: [{ value: 0, disabled: true }]
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

    onFuelTypeChange() {
      const year = this.fuelForm.get('year')?.value;
      const fuelType = this.fuelForm.get('fuelType')?.value;
      this.fuelDataService.getFuelData(year, fuelType).subscribe(fuelValue => {
        console.log(`Selected Year: ${year}, Selected Fuel: ${fuelType}, Value: ${fuelValue}`);
        // Puedes actualizar el formulario o realizar otras acciones con el valor del combustible seleccionado
      });
    }

    openDialog(title:string, text: string): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: title,
          text: text,
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