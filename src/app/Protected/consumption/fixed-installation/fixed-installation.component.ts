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
  displayedColumns: string[] = ['delegation', 'year', 'tipoCombustible', 'kg_CO2_ud_defecto', 'gCH4_ud_defecto', 'gN2O_ud_defecto', 'g CO2_ud_otros', 'gCH4_ud_otros', 'gN2O_ud_otros', 'kg__CO2', 'g_CH4', 'g_N2O', 'kg__CO2e', 'edit', 'delete']
    data = [
      { delegation: 'Central', year: 2024, tipoCombustible: 'Gas propano (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Felanitx', year: 2024, tipoCombustible: 'Biogás (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Manacor', year: 2024, tipoCombustible: 'Biomasa madera (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},  
      { delegation: 'Calvià', year: 2024, tipoCombustible: 'Carbón vegetal (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Andraitx', year: 2024, tipoCombustible: 'Hulla y antracita (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Pollença', year: 2024, tipoCombustible: 'Gasólea A', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
    ];
    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm: FormGroup;
    fuelTypes: string[] = ['Gasóleo C (l)', 'Gasóleo B (l)', 'Gas natural (kWhPCS)*', 
      'Fuelóleo (l)', 'LPG (l)', 'Queroseno (l)', 'Gas propano (kg)', 'Gas butano (kg)', 
      'Gas manufacturado (kg)', 'Biogás (kg)**', 'Biomasa madera (kg)**', 'Biomasa pellets (kg)**', 
      'Biomasa astillas (kg)**', 'Biomasa serrines virutas (kg)**', 'Biomasa cáscara f. secos (kg)**', 
      'Biomasa hueso aceituna (kg)**', 'Carbón vegetal (kg)**', 'Coque de petróleo (kg)', 'Coque de carbón (kg)', 
      'Hulla y antracita (kg)', 'Hullas subituminosas (kg)', 'B7 (I)','B10 (I)', 'B20 (I)', 'B30 (I)', 'B100 (I)', 'E5 (I)', 'E10 (I)','E85 (I)', 'E100 (I)'];
     
    constructor(private fb: FormBuilder, public dialog: MatDialog, private fuelDataService: FuelDataService) {
      this.fuelForm = this.fb.group({
        year: [{ value: '2025', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        building: [{value: 'Centro de producción A', disabled: true}],
        fuelType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        defaultFactor: this.fb.group({
          co2: [{ value: 0, disabled: true }],
          ch4: [{ value: 0, disabled: true }],
          n2o: [{ value: 0, disabled: true }]
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