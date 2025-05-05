import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiclesFuelConsumptionService } from '../../../services/vehicles-fuel-consumption.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { MesesService } from '../../../services/meses.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class MachineryVehiclesComponent  implements OnInit, OnChanges {
  @Input() activityYear!: number
  @Input() productionCenter!: number
  displayedColumns: string[] = ['activity Year', 'Period', 'equipment Type', 'fuel Type', 'activity Data', 'total Emissions', 'updated At', 'delete']
  data = [ { }, ]
  dataSource = new MatTableDataSource<any>(this.data)
  vehicleCategories: any[] = []
  fuelTypes: any[] = []
  vehicleForm!: FormGroup;
  showField: boolean = false
  token: string = '' // Token del usuario
  organizacionID!: number // ID de la organización

  constructor (private fb: FormBuilder, 
    private scopeOneRecordsService: ScopeOneRecordsService,
    private vehicleFuelService: VehiclesFuelConsumptionService,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private productionCenterService: ProductioncenterService,
    private mesesService: MesesService,
    private snackBar: MatSnackBar
  ) {
    this.token = this.authService.getToken() || ''
    this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      periodoFactura: ['', Validators.required],
      equipmentType: ['', Validators.required],
      fuelType: ['', Validators.required],
      activityData: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      defaultEmissionFactor: this.fb.group({
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
    this.getFuelConsumptions(this.activityYear)
    this.getScopeOneRecords (this.activityYear, this.productionCenter, this.organizacionID)
    this.setupValueChangeListeners()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeOneRecords(this.activityYear, this.productionCenter, this.organizacionID)
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

getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, organizationID: number = this.organizacionID, activityType: string = 'roadTransp') {
    this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, organizationID, activityType)
      .subscribe({
        next: (registros: any) => {
          this.vehicleFuelService.getByYear(this.activityYear)
          .subscribe((fuelTypes:any) => {
            this.fuelTypes = fuelTypes
            const meses = this.mesesService.getMeses();
            registros.data.forEach((registro: any) => {
              registro.edit = true
              registro.delete = true
              registro['activity Year'] = registro.year
              registro['updated At'] = registro.updated_at
              const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
              registro['equipment Type'] = matchedFuel?.Categoria  || 'desconocido';
              registro['fuel Type'] = matchedFuel?.FuelType    || 'desconocido';
              const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
              registro.periodoFactura = resultado?.value   || 'desconocido';
              registro['Period'] = registro.periodoFactura
              registro['activity Data'] = registro.activityData
              const co2 = registro.activityData * parseFloat(matchedFuel.CO2_kg_ud || 0);
              const ch4 = registro.activityData * parseFloat(matchedFuel.CH4_g_ud || 0);
              const n2o = registro.activityData * parseFloat(matchedFuel.NO2_g_ud || 0);
              registro['total Emissions'] = '<strong>' + (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString()+' (tnCO2eq)</strong>'; 
            })
            this.dataSource = new MatTableDataSource(registros.data)        
          })
        },
        error: (err: any) => {
          this.showSnackBar('Error al obtener los registros: ' + err)
        }
      });
}

  // Configuración de los listeners para recalcular valores
setupValueChangeListeners(): void {
  this.vehicleForm.get('fuelType')?.valueChanges.subscribe((selectedFuel) => {
    if (selectedFuel) {
      this.setEmissionFactors();
      this.calculateEmissions();
    }
  });

  this.vehicleForm.get('activityData')?.valueChanges.subscribe(() => {
    console.log('activityData changed')
    this.onactivityDataChange();
  });
}

onSubmit() {
    const formValue = this.vehicleForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.equipmentType = this.vehicleForm.get('equipmentType')?.value.id
    formValue.fuelType = this.vehicleForm.get('fuelType')?.value.id
    formValue.activityType = 'roadTransp'
    formValue.id_empresa = this.organizacionID
    formValue.activityData = this.vehicleForm.get('activityData')?.value
    this.scopeOneRecordsService.createRecord(formValue)
      .subscribe(
        (fuel: any) => {
          this.showSnackBar(fuel.message);
          this.getScopeOneRecords(this.activityYear, this.productionCenter, this.organizacionID, 'roadTransp')
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
  this.vehicleForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.activityData *  parseFloat(CO2_kg_ud));
  this.vehicleForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.activityData * parseFloat(CH4_g_ud));
  this.vehicleForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.activityData * parseFloat(N2O_g_ud));
  this.vehicleForm.get('totalEmissions')?.setValue(fuelData.activityData * parseFloat(CO2_kg_ud)+fuelData.activityData * parseFloat(CH4_g_ud)+fuelData.activityData * parseFloat(N2O_g_ud))
}

onactivityDataChange() {
  if (this.vehicleForm.valid) {
    const fuelData = this.vehicleForm.value
    const fuelType = fuelData.fuelType
    const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
    const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
    const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
    this.vehicleForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.activityData * CO2_kg_ud);
    this.vehicleForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.activityData * CH4_g_ud);
    this.vehicleForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.activityData * N2O_g_ud);
    this.vehicleForm.get('totalEmissions')?.setValue(fuelData.activityData * CO2_kg_ud+fuelData.activityData * CH4_g_ud+fuelData.activityData * N2O_g_ud)
  }
}

calculateEmissions(): void {
  const activityData = this.vehicleForm.get('activityData')?.value || 0;
  const defaultFactorGroup = this.vehicleForm.get('defaultFactor');
  const partialEmissionsGroup = this.vehicleForm.get('partialEmissions');

  if (defaultFactorGroup && partialEmissionsGroup) {
    const co2 = activityData * parseFloat(defaultFactorGroup.get('fe_co2')?.value || 0);
    const ch4 = activityData * parseFloat(defaultFactorGroup.get('fe_ch4')?.value || 0);
    const n2o = activityData * parseFloat(defaultFactorGroup.get('fe_n2o')?.value || 0);

    partialEmissionsGroup.get('co2')?.setValue(co2.toFixed(3));
    partialEmissionsGroup.get('ch4')?.setValue(ch4.toFixed(3));
    partialEmissionsGroup.get('n2o')?.setValue(n2o.toFixed(3));

    // Calcula emisiones totales en toneladas de CO2 equivalente
    const totalEmissions = co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298;
    this.vehicleForm.get('totalEmissions')?.setValue(totalEmissions.toFixed(3));
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