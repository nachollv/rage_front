import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiclesFuelConsumptionService } from '../../../services/vehicles-fuel-consumption.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class MachineryVehiclesComponent {
    displayedColumns: string[] = ['calculationYear', 'productionCenter', 'vehicle_type','fuel_type', 'quantity', 'edit', 'delete']
      data = [ { }, ]
      dataSource = new MatTableDataSource<any>(this.data)
      vehicleTypes: any[] = []
      fuelTypes: any[] = []
      vehicleForm: FormGroup;
      showField: boolean = false
      
  constructor (private fb: FormBuilder, 
    private scopeOneRecordsService: ScopeOneRecordsService,
    private vehicleFuelService: VehiclesFuelConsumptionService,
    private productionCenterService: ProductioncenterService,
    private snackBar: MatSnackBar
  ) {
    this.vehicleForm = this.fb.group({
      calculationYear: [{ value: '2023', disabled: true }],
      productionCenter: [{ value: '6', disabled: true }],
      vehicleCategory: ['', Validators.required],
      fuelType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      defaultEmissionFactor: this.fb.group({
        co2: [{ value: '', disabled: true }, Validators.required],
        ch4: [{ value: '', disabled: true }, Validators.required],
        n2o: [{ value: '', disabled: true }, Validators.required]
      }),
      partialEmissions: this.fb.group({
        co2: [{ value: '', disabled: true }],
        ch4: [{ value: '', disabled: true }],
        n2o: [{ value: '', disabled: true }]
      }),
      totalEmissions: [{ value: '', disabled: true }]
    });
    this.getProductionCenterDetails(this.vehicleForm.get('productionCenter')!.value)
    this.getFuelConsumptions()
    this.getScopeOneRecords(2023, 6)

  }

  getProductionCenterDetails(id:number) {
    this.productionCenterService.getCentroDeProduccionByID(id)
      .subscribe((pCenterItem: any) => {
        this.vehicleForm.patchValue({
          productionCenter: pCenterItem.nombre
        })
      })
  }

  getFuelConsumptions() {
    this.vehicleFuelService.getByYear(2023)
      .subscribe((fuel:any) => {
      this.vehicleTypes = fuel
      })
  }

  getScopeOneRecords(calculationYear: number = 2023, productionCenter: number = 6, activityType: string = 'machinery') {
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
    this.vehicleForm.get('productionCenter')?.value, 
    this.vehicleForm.get('quantity')?.value, this.vehicleForm.get('fuelType')?.value.id;
    const formValue = this.vehicleForm.value
    formValue.calculationYear = this.vehicleForm.get('calculationYear')?.value
    formValue.productionCenter = this.vehicleForm.get('productionCenter')?.value
    formValue.vehicle_type = this.vehicleForm.get('vehicleCategory')?.value.id
    formValue.fuel_type = this.vehicleForm.get('fuelType')?.value.id
    formValue.activityType = 'machinery'
    formValue.quantity = this.vehicleForm.get('quantity')?.value

    this.scopeOneRecordsService.createRecord(formValue)
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

  setFuelTypes() {

    const machineryData = this.vehicleForm.value
    console.log (machineryData.vehicleCategory.Categoria)
    this.vehicleFuelService.getByYearType(2023, machineryData.vehicleCategory.Categoria)
      .subscribe((fuelTypes:any) => {
        this.fuelTypes = fuelTypes
      })

}

setEmissionFactors () {
  const fuelData = this.vehicleForm.value
  const fuelType = fuelData.fuelType
  const CO2_kg_ud = parseFloat(fuelType.CO2_kg_ud).toFixed(3);
  const CH4_g_ud = parseFloat(fuelType.CH4_g_ud).toFixed(3);
  const N2O_g_ud = parseFloat(fuelType.N2O_g_ud).toFixed(3);
  this.vehicleForm.get('defaultEmissionFactor')?.get('co2')?.setValue(CO2_kg_ud);
  this.vehicleForm.get('defaultEmissionFactor')?.get('ch4')?.setValue(CH4_g_ud);
  this.vehicleForm.get('defaultEmissionFactor')?.get('n2o')?.setValue(N2O_g_ud);
  this.vehicleForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity *  parseFloat(CO2_kg_ud));
  this.vehicleForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * parseFloat(CH4_g_ud));
  this.vehicleForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * parseFloat(N2O_g_ud));
  this.vehicleForm.get('totalEmissions')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud)+fuelData.quantity * parseFloat(CH4_g_ud)+fuelData.quantity * parseFloat(N2O_g_ud))
}

onQuantityChange() {
  if (this.vehicleForm.valid) {
    const fuelData = this.vehicleForm.value
    const fuelType = fuelData.fuelType
    const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
    const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
    const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
    console.log (CO2_kg_ud, CH4_g_ud,  N2O_g_ud)
    console.log('Quantity:', fuelData.quantity* CH4_g_ud, fuelData.quantity*CO2_kg_ud, fuelData.quantity*N2O_g_ud);
    this.vehicleForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity * CO2_kg_ud);
    this.vehicleForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * CH4_g_ud);
    this.vehicleForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * N2O_g_ud);
    this.vehicleForm.get('totalEmissions')?.setValue(fuelData.quantity * CO2_kg_ud+fuelData.quantity * CH4_g_ud+fuelData.quantity * N2O_g_ud)
  }
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