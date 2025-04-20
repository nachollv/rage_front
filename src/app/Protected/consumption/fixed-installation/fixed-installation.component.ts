import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';

@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})

export class FixedInstallationComponent implements OnInit, OnChanges {
    @Input() activityYear!: number
    @Input() productionCenter: number = 0
    displayedColumns: string[] = ['calculationYear', 'productionCenter', 'fuel_type', 'quantity', 'edit', 'delete']
    data = [{ }]
    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm!: FormGroup;
    fuelTypes: any[] = []
    showField: boolean = false
    
    constructor(private fb: FormBuilder, public dialog: MatDialog,
      private fuelDataService: FuelDataService,
      private productionCenterService: ProductioncenterService,
      private scopeOneRecordsService: ScopeOneRecordsService,
      private snackBar: MatSnackBar) {
     
    }

    ngOnInit(): void {
      this.fuelForm = this.fb.group({
        calculationYear: [{ value: this.activityYear, disabled: true }],
        productionCenter: [{value: this.productionCenter, disabled: true}],
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
      
      this.getFuelConsumptions(this.activityYear)
      this.getScopeOneRecords(this.activityYear, this.productionCenter)
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['activityYear'] && !changes['activityYear'].firstChange) {
        this.getFuelConsumptions(+this.activityYear);
      }
    }

    getFuelConsumptions(year: number) {
      this.fuelDataService.getByYear(year)
      .subscribe((fuel:any) => {
        this.fuelTypes = fuel
      })
    }

    getScopeOneRecords(calculationYear: number = 2023, productionCenter: number = 6, activityType: string = 'fixed') {
      this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, activityType)
        .subscribe({
          next: (registros: any) => {
            registros.data.forEach((registro: any) => {
              registro.edit = true
              registro.delete = true
              registro.fuel_type = this.fuelTypes.find((fuelType: any) => fuelType.id === registro.fuel_type)?.Combustible || 'desconocido'
            })
            this.dataSource = new MatTableDataSource(registros.data)
            this.showSnackBar('Registros obtenidos fixed: ' + registros.data.length)
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros: ' + err)
          }
        });
    }
    
    onSubmit() {
        this.fuelForm.get('productionCenter')?.value, 
        this.fuelForm.get('quantity')?.value, this.fuelForm.get('fuelType')?.value.id;
        const formValue = this.fuelForm.value
        formValue.calculationYear = this.fuelForm.get('calculationYear')?.value
        formValue.productionCenter = this.fuelForm.get('productionCenter')?.value
        formValue.calculationYear = this.activityYear
        formValue.productionCenter = this.productionCenter
        formValue.fuel_type = this.fuelForm.get('fuelType')?.value.id
        formValue.activityType = 'fixed'
        formValue.quantity = this.fuelForm.get('quantity')?.value

        this.scopeOneRecordsService.createRecord(formValue)
          .subscribe(
            (fuel: any) => {
              this.showSnackBar('Éxito:' + fuel);
              this.getFuelConsumptions(this.activityYear)
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
        const CH4_g_ud = parseFloat( fuelType.CH4_g_ud )/1000;
        const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
        const N2O_g_ud = parseFloat( fuelType.N2O_g_ud )/1000;
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

    private showSnackBar(msg: string): void {
      this.snackBar.open(msg, 'Close', {
        duration: 15000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }