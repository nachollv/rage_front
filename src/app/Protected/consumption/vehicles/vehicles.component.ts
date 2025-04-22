import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class MachineryVehiclesComponent  implements OnInit, OnChanges {
  @Input() activityYear!: number
  @Input() productionCenter!: number
    displayedColumns: string[] = ['year', 'categoria', 'fuelType', 'quantity', 'updated_at', 'edit', 'delete']
      data = [ { }, ]
      dataSource = new MatTableDataSource<any>(this.data)
      vehicleCategories: any[] = []
      fuelTypes: any[] = []
      vehicleForm!: FormGroup;
      showField: boolean = false
      
  constructor (private fb: FormBuilder, 
    private scopeOneRecordsService: ScopeOneRecordsService,
    private vehicleFuelService: VehiclesFuelConsumptionService,
    private productionCenterService: ProductioncenterService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      year: [{ value: this.activityYear }],
      productionCenter: [{ value: this.productionCenter }],
      equipmentType: ['', Validators.required],
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
    this.getFuelConsumptions(this.activityYear)
    this.getScopeOneRecords (this.activityYear, this.productionCenter)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeOneRecords(this.activityYear, this.productionCenter)
    }
  }

  getProductionCenterDetails(id:number) {
    this.productionCenterService.getCentroDeProduccionByID(id)
      .subscribe((pCenterItem: any) => {
        this.vehicleForm.patchValue({
          productionCenter: pCenterItem.nombre
        })
      })
  }

  getFuelConsumptions(year: number) {
    this.vehicleFuelService.getByYear(year)
      .subscribe((fuel:any) => {
      this.vehicleCategories = fuel
      })
  }

  getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, activityType: string = 'vehicles') {
    this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, activityType)
      .subscribe({
        next: (registros: any) => {
          this.vehicleFuelService.getByYear(this.activityYear)
          .subscribe((fuelTypes:any) => {
            this.fuelTypes = fuelTypes
            registros.data.forEach((registro: any) => {
              registro.edit = true
              registro.delete = true
              const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
              registro.fuelType = matchedFuel?.FuelType || 'desconocido';
              registro.categoria = matchedFuel?.Categoria || 'desconocido';
            })
            this.dataSource = new MatTableDataSource(registros.data)
            this.showSnackBar('Registros obtenidos fixed: ' + registros.data.length)            
          })
         /*  this.dataSource = new MatTableDataSource(registros.data)
          this.showSnackBar('Registros obtenidos fixed: ' + registros.data.length) */
        },
        error: (err: any) => {
          this.showSnackBar('Error al obtener los registros: ' + err)
        }
      });
  }

  onSubmit() {
    const formValue = this.vehicleForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.fuelType = this.vehicleForm.get('fuelType')?.value.id
    formValue.activityType = 'vehicles'
    formValue.quantity = this.vehicleForm.get('quantity')?.value
    console.log("formValue: ", formValue)
    this.scopeOneRecordsService.createRecord(formValue)
      .subscribe(
        (fuel: any) => {
          this.showSnackBar('Éxito:' + fuel);
          this.getFuelConsumptions(this.activityYear)
          this.vehicleForm.reset()
        },
        (error: any) => {
          this.showSnackBar('Error al crear:' + error);
      }
      );
  }

  setFuelTypes() {
    const vehicleData = this.vehicleForm.value
    this.vehicleFuelService.getByYearType(this.activityYear, vehicleData.equipmentType.Categoria)
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