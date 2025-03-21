import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})
export class FixedInstallationComponent {
  displayedColumns: string[] = ['calculationYear', 'productionCenter', 'fuel_type', 'quantity', 'edit', 'delete']
  data = [{ }]

    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm: FormGroup;
    fuelTypes: any[] = []
    
    constructor(private fb: FormBuilder, public dialog: MatDialog,
      private fuelDataService: FuelDataService,
      private scopeOneRecordsService: ScopeOneRecordsService,
      private snackBar: MatSnackBar) {
      this.fuelForm = this.fb.group({
        calculationYear: [{ value: '2023', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        productionCenter: [{value: '1', disabled: true}],
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
      this.getFuelConsumptions(2023)
      this.getScopeOneRecords(2023, 1)
    }

    getFuelConsumptions(calculationYear: number = 2023) {
      this.fuelDataService.getByYear(calculationYear)
        .subscribe((fuel:any) => {
        this.fuelTypes = fuel
        })
    }

    getScopeOneRecords(calculationYear: number = 2023, productionCenter: number = 1) {
      this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter)
        .subscribe({
          next: (registros: any) => {
            registros.data.forEach((registro: any) => {
              registro.edit = true
              registro.delete = true
              registro.fuel_type = this.fuelTypes.find((fuelType: any) => fuelType.id === registro.fuel_type) || {}
              console.log(registro.fuel_type)
            })
            this.dataSource = new MatTableDataSource(registros.data)
            this.showSnackBar('Registros obtenidos: ' + registros.data.length)
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros: ' + err)
          }
        });
    }
    
    onSubmit() {
        console.log('Formulario válido: ', this.fuelForm.get('calculationYear')?.value, 
        this.fuelForm.get('productionCenter')?.value, 
        this.fuelForm.get('quantity')?.value, this.fuelForm.get('fuelType')?.value.id);
        const formValue = this.fuelForm.value
        formValue.calculationYear = this.fuelForm.get('calculationYear')?.value
        formValue.productionCenter = this.fuelForm.get('productionCenter')?.value
        formValue.fuel_type = this.fuelForm.get('fuelType')?.value.id
        formValue.quantity = this.fuelForm.get('quantity')?.value

        this.scopeOneRecordsService.createRecord(this.fuelForm.value)
          .subscribe(
            (fuel: any) => {
              this.showSnackBar('Éxito:' + fuel);
              this.getFuelConsumptions()
            },
            (error: any) => {
              this.showSnackBar('Error al crear:' + error);
            }
          );
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

    onQuantityChange() {

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
        duration: 15000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }