import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})
export class FixedInstallationComponent {
  displayedColumns: string[] = ['delegation', 'year', 'tipoCombustible', 'kg_CO2_ud_defecto', 'gCH4_ud_defecto', 'gN2O_ud_defecto', 'g CO2_ud_otros', 'gCH4_ud_otros', 'gN2O_ud_otros', 'kg__CO2', 'g_CH4', 'g_N2O', 'kg__CO2e', 'edit', 'delete']
    data = [
      { delegation: 'Central', year: 2023, tipoCombustible: 'Gas propano (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Felanitx', year: 2023, tipoCombustible: 'Biogás (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Manacor', year: 2023, tipoCombustible: 'Biomasa madera (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},  
      { delegation: 'Calvià', year: 2023, tipoCombustible: 'Carbón vegetal (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Andraitx', year: 2023, tipoCombustible: 'Hulla y antracita (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      { delegation: 'Pollença', year: 2023, tipoCombustible: 'Gasólea A', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
    ];
    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm: FormGroup;
    fuelTypes: any[] = []
    
    constructor(private fb: FormBuilder, public dialog: MatDialog, private fuelDataService: FuelDataService, private snackBar: MatSnackBar) {
      this.fuelForm = this.fb.group({
        year: [{ value: '2023', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        building: [{value: '', disabled: true}],
        fuelType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        defaultFactor: this.fb.group({
          fe_co2: [{ value: null, disabled: true }],
          fe_ch4: [{ value: null, disabled: true }],
          fe_n2o: [{ value: null, disabled: true }]
        }),
        partialEmissions: this.fb.group({
          co2: [{ value: null, disabled: true }],
          ch4: [{ value: null, disabled: true }],
          n2o: [{ value: null, disabled: true }]
        }),
        totalEmissions: [{ value: 0, disabled: true }]
      });
      this.getFuelConsumptions()
    }

    getFuelConsumptions() {
      this.fuelDataService.getByYear(2023)
        .subscribe((fuel:any) => {
        this.fuelTypes = fuel
        })
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

    setEmissionFactors() {
        const fuelData = this.fuelForm.value
        const fuelType = fuelData.fuelType
        const CO2_kg_ud = parseFloat(fuelType.CO2_kg_ud).toFixed(3);
        const CH4_g_ud = parseFloat(fuelType.CH4_g_ud).toFixed(3);
        const N2O_g_ud = parseFloat(fuelType.N2O_g_ud).toFixed(3);
        this.fuelForm.get('defaultFactor')?.get('fe_co2')?.setValue(CO2_kg_ud);
        this.fuelForm.get('defaultFactor')?.get('fe_ch4')?.setValue(CH4_g_ud);
        this.fuelForm.get('defaultFactor')?.get('fe_n2o')?.setValue(N2O_g_ud);
        this.fuelForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity *  parseFloat(CO2_kg_ud));
        this.fuelForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * parseFloat(CH4_g_ud));
        this.fuelForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * parseFloat(N2O_g_ud));
        this.fuelForm.get('totalEmissions')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud)+fuelData.quantity * parseFloat(CH4_g_ud)+fuelData.quantity * parseFloat(N2O_g_ud))
    }

    onFuelTypeChange() {

      if (this.fuelForm.valid) {
        const fuelData = this.fuelForm.value
        const fuelType = fuelData.fuelType
        const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
        const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
        const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
        console.log (CO2_kg_ud, CH4_g_ud,  N2O_g_ud)
        console.log('Quantity:', fuelData.quantity* CH4_g_ud, fuelData.quantity*CO2_kg_ud, fuelData.quantity*N2O_g_ud);
        this.fuelForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity * CO2_kg_ud);
        this.fuelForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * CH4_g_ud);
        this.fuelForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * N2O_g_ud);
        this.fuelForm.get('totalEmissions')?.setValue(fuelData.quantity * CO2_kg_ud+fuelData.quantity * CH4_g_ud+fuelData.quantity * N2O_g_ud)
      }
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

    private showSnackBar(error: string): void {
      this.snackBar.open(error, 'Close', {
        duration: 1500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }