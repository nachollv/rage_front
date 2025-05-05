import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { MesesService } from '../../../services/meses.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-fixed-installation',
  templateUrl: './fixed-installation.component.html',
  styleUrl: './fixed-installation.component.scss'
})

export class FixedInstallationComponent implements OnInit, OnChanges {
    @Input() activityYear!: number
    @Input() productionCenter: number = 0
    displayedColumns: string[] = ['activity Year', 'Period', 'fuel Type', 'activity Data', 'total Emissions', 'updated At', 'delete']
    data = [{ }]
    dataSource = new MatTableDataSource<any>(this.data)
    fuelForm!: FormGroup;
    fuelTypes: any[] = []
    token: string = '' // Token del usuario
    organizacionID!: number // ID de la organización

    constructor(private fb: FormBuilder, public dialog: MatDialog,
      private fuelDataService: FuelDataService,
      private scopeOneRecordsService: ScopeOneRecordsService,
      private mesesService: MesesService,
      private jwtHelper: JwtHelperService,
      private authService: AuthService,
      private snackBar: MatSnackBar) {
        this.token = this.authService.getToken() || ''
        this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
      }

    ngOnInit(): void {
      this.fuelForm = this.fb.group({
        periodoFactura: ['', Validators.required],
        fuelType: ['', Validators.required],
        activityData: ['', [Validators.required, Validators.min(0)]],
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
      this.getScopeOneRecords(this.activityYear, this.productionCenter, this.organizacionID)
      this.setupValueChangeListeners()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['activityYear'] && !changes['activityYear'].firstChange) {
        this.getFuelConsumptions(this.activityYear);
      }
    }

    getFuelConsumptions(year: number) {
      this.fuelDataService.getByYear(year)
      .subscribe((fuel:any) => {
        this.fuelTypes = fuel
      })
    }

    getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, organizacionID: number = this.organizacionID, activityType: string = 'fixed') {
      this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, organizacionID, activityType)
        .subscribe({
          next: (registros: any) => {

            this.fuelDataService.getByYear(calculationYear)
            .subscribe((fuel:any) => {
              this.fuelTypes = fuel
              const meses = this.mesesService.getMeses();
              registros.data.forEach((registro: any) => {
                registro.edit = true
                registro.delete = true
                const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                registro.fuelType = matchedFuel?.Combustible || 'desconocido';
                const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                registro.periodoFactura = resultado?.value   || 'desconocido';
                registro['activity Year'] = registro.year
                registro['Period'] = registro.periodoFactura
                registro['fuel Type'] = registro.fuelType
                registro['activity Data'] = registro.activityData
                registro['updated At'] = registro.updated_at
                const co2 = registro.activityData * parseFloat(matchedFuel.CO2_kg_ud || 0);
                const ch4 = registro.activityData * parseFloat(matchedFuel.CH4_g_ud || 0);
                const n2o = registro.activityData * parseFloat(matchedFuel.NO2_g_ud || 0);
                registro['total Emissions'] = '<strong>' + (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString()+' (tnCO2eq)</strong>'; 
              })
              this.dataSource = new MatTableDataSource(registros.data)
            })
          
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
          }
        });
    }

// Configuración de los listeners para recalcular valores
setupValueChangeListeners(): void {
  this.fuelForm.get('fuelType')?.valueChanges.subscribe((selectedFuel) => {
    if (selectedFuel) {
      this.setEmissionFactors();
      this.calculateEmissions();
    }
  });

  this.fuelForm.get('activityData')?.valueChanges.subscribe(() => {
    this.calculateEmissions();
  });
}
    
onSubmit() {
        const formValue = this.fuelForm.value
        formValue.year = this.activityYear
        formValue.productionCenter = this.productionCenter
        formValue.fuelType = this.fuelForm.get('fuelType')?.value.id
        formValue.activityType = 'fixed'
        formValue.id_empresa = this.organizacionID
        formValue.activityData = this.fuelForm.get('activityData')?.value
        this.scopeOneRecordsService.createRecord(formValue)
          .subscribe(
            (fuel: any) => {
              this.showSnackBar(fuel.message)
              this.getScopeOneRecords(this.activityYear, this.productionCenter, this.organizacionID, 'fixed')
              this.fuelForm.reset()
            },
            (error: any) => {
              this.showSnackBar('Error al crear:' + error)
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

        this.fuelForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.activityData *  parseFloat(CO2_kg_ud));
        this.fuelForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.activityData * parseFloat(CH4_g_ud));
        this.fuelForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.activityData * parseFloat(N2O_g_ud));
      
        this.fuelForm.get('totalEmissions')?.setValue(fuelData.activityData * parseFloat(CO2_kg_ud)+fuelData.activityData * parseFloat(CH4_g_ud)+fuelData.activityData * parseFloat(N2O_g_ud))
}

    calculateEmissions(): void {
      const activityData = this.fuelForm.get('activityData')?.value || 0;
      const defaultFactorGroup = this.fuelForm.get('defaultFactor');
      const partialEmissionsGroup = this.fuelForm.get('partialEmissions');
  
      if (defaultFactorGroup && partialEmissionsGroup) {
        const co2 = activityData * parseFloat(defaultFactorGroup.get('fe_co2')?.value || 0);
        const ch4 = activityData * parseFloat(defaultFactorGroup.get('fe_ch4')?.value || 0);
        const n2o = activityData * parseFloat(defaultFactorGroup.get('fe_n2o')?.value || 0);
  
        partialEmissionsGroup.get('co2')?.setValue(co2.toFixed(3));
        partialEmissionsGroup.get('ch4')?.setValue(ch4.toFixed(3));
        partialEmissionsGroup.get('n2o')?.setValue(n2o.toFixed(3));
  
        // Calcula emisiones totales en toneladas de CO2 equivalente
        const totalEmissions = co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298;
        this.fuelForm.get('totalEmissions')?.setValue(totalEmissions.toFixed(3));
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
        duration: 10000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }