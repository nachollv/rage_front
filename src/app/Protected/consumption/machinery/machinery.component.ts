import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesMachineryService } from '../../../services/emisiones-machinery.service';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MesesService } from '../../../services/meses.service';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent implements OnInit, OnChanges {
  @Input() activityYear: number = 0
  @Input() productionCenter: number = 0
  emissionsForm!: FormGroup;
  showField: boolean = false
  displayedColumns: string[] = ['activity Year', 'Period', 'categoria', 'fuel Type', 'activity Data', 'total Emissions', 'updated At', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  fuelEmisTypes: any[] = []

  constructor( private fb: FormBuilder,
      private emisionesMachineryService: EmisionesMachineryService,
      private snackBar: MatSnackBar,
      private mesesService: MesesService,
      private scopeOneRecordsService: ScopeOneRecordsService,
      ) { }

  ngOnInit(): void { 
    this.emissionsForm = this.fb.group({
           periodoFactura: ['', Validators.required],
           equipmentType: ['', Validators.required],
           fuelType: ['', Validators.required],
           activityData: [0, [Validators.required, Validators.min(0)]],
           defaultEmissionFactor: this.fb.group({
             co2: [{ value: 0, disabled: true }, Validators.required],
             ch4: [{ value: 0, disabled: true }, Validators.required],
             n2o: [{ value: 0, disabled: true }, Validators.required]
           }),
           partialEmissions: this.fb.group({
             co2: [{ value: 0, disabled: true }, Validators.required],
             ch4: [{ value: 0, disabled: true }, Validators.required],
             n2o: [{ value: 0, disabled: true }, Validators.required]
           }),
           totalEmissions: [{ value: 0, disabled: true }]
         });
         this.getScopeOneRecords()
         this.setupValueChangeListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeOneRecords(this.activityYear, this.productionCenter)
    }
  }

  getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, activityType: string = 'machinery') {
        this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, activityType)
          .subscribe({
            next: (registros: any) => {
              this.emisionesMachineryService.getEmisionesByYear(calculationYear)
              .subscribe((emissions:any) => {
                this.fuelEmisTypes = emissions
                const meses = this.mesesService.getMeses();
                registros.data.forEach((registro: any) => {
                  registro.edit = true
                  registro.delete = true
                  registro['activity Year'] = registro.year
                  registro['updated At'] = registro.updated_at
                  const matchedFuel = this.fuelEmisTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                  registro.fuelType = matchedFuel?.FuelType || 'desconocido';
                  registro.categoria = matchedFuel?.Categoria || 'desconocido';
                  const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                  registro.periodoFactura = resultado?.value   || 'desconocido';
                  registro['Period'] = registro.periodoFactura
                  registro['fuel Type'] = matchedFuel?.FuelType    || 'desconocido';
                  registro['activity Data'] = registro.activityData
                  const co2 = registro.activityData * parseFloat(matchedFuel.CO2_kg_l || 0);
                  const ch4 = registro.activityData * parseFloat(matchedFuel.CH4_g_l || 0);
                  const n2o = registro.activityData * parseFloat(matchedFuel.N2O_g_l || 0);
                  registro['total Emissions'] = '<strong>' + (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString()+' (tnCO2eq)</strong>';
                  console.log ("total emissions ", registro['total Emissions'])
                })
                this.dataSource = new MatTableDataSource(registros.data)
              })
            },
            error: (err: any) => {
              this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
            }
          });
  }

  setupValueChangeListeners(): void {
    // Listener para fuelType
    this.emissionsForm.get('fuelType')?.valueChanges.subscribe((selectedFuel) => {
      if (selectedFuel) {
        this.setEmissionFactors();
        this.calculateEmissions();
      }
    });

    // Listener para activityData
    this.emissionsForm.get('activityData')?.valueChanges.subscribe(() => {
      this.calculateEmissions();
    });

    // Listener para equipmentType (puedes agregar lógica específica si es necesario)
    this.emissionsForm.get('equipmentType')?.valueChanges.subscribe(() => {
      this.calculateEmissions();
    });
  }

  calculateEmissions(): void {
    const activityData = this.emissionsForm.get('activityData')?.value || 0;
    const defaultEmissionFactorGroup = this.emissionsForm.get('defaultEmissionFactor');
    const partialEmissionsGroup = this.emissionsForm.get('partialEmissions');

    if (defaultEmissionFactorGroup && partialEmissionsGroup) {
      const co2 = activityData * parseFloat(defaultEmissionFactorGroup.get('co2')?.value || 0);
      const ch4 = activityData * parseFloat(defaultEmissionFactorGroup.get('ch4')?.value || 0);
      const n2o = activityData * parseFloat(defaultEmissionFactorGroup.get('n2o')?.value || 0);

      partialEmissionsGroup.get('co2')?.setValue(co2.toFixed(3));
      partialEmissionsGroup.get('ch4')?.setValue(ch4.toFixed(3));
      partialEmissionsGroup.get('n2o')?.setValue(n2o.toFixed(3));

      // Calcula emisiones totales en toneladas de CO2 equivalente
      const totalEmissions = co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298;
      this.emissionsForm.get('totalEmissions')?.setValue(totalEmissions.toFixed(3));
    }
  }

  onSubmit(): void {
    const formValue = this.emissionsForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.activityType = 'machinery'
    formValue.fuelType = this.emissionsForm.get('fuelType')?.value.id
    this.scopeOneRecordsService.createRecord(formValue)
      .subscribe(
        (result: any) => {
          this.showSnackBar(result.message);
          this.getScopeOneRecords(this.activityYear, this.productionCenter, 'machinery')
          this.emissionsForm.reset()
        },
        (error: any) => {
          this.showSnackBar('Error al crear:' + error);
      }
      );
  }

  onMachineryChange(selectedMachinery: string): void {
    this.getFuelEmissions(this.activityYear, selectedMachinery)
  }

  onActivityDataChange() {
    const fuelData = this.emissionsForm.value
    const fuelType = fuelData.fuelType
    const CH4_g_l = parseFloat( fuelType.CH4_g_l  || 0).toFixed(3);
    const CO2_kg_l = parseFloat( fuelType.CO2_kg_l  || 0).toFixed(3);
    const N2O_g_l = parseFloat( fuelType.N2O_g_l  || 0).toFixed(3);
    this.emissionsForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.activityData * parseFloat(CO2_kg_l));
    this.emissionsForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.activityData * parseFloat(CH4_g_l));
    this.emissionsForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.activityData * parseFloat(N2O_g_l));
    this.emissionsForm.get('totalEmissions')?.setValue(
      fuelData.activityData * parseFloat(CO2_kg_l) +
      fuelData.activityData * parseFloat(CH4_g_l) +
      fuelData.activityData * parseFloat(N2O_g_l)
    );
  }

  getFuelEmissions(year: number, selectedTransport: string) {
    this.fuelEmisTypes = [] // Reiniciar el array de tipos de combustible
    this.emisionesMachineryService.getEmisionesByYear(year)
    .subscribe((emissions:any) => {
      this.fuelEmisTypes = emissions
      console.log('emissions: ', this.fuelEmisTypes)
      this.fuelEmisTypes = this.fuelEmisTypes.filter((fuelType: any) => fuelType.Categoria === selectedTransport)
    })
  }

  setEmissionFactors () {
    const fuelData = this.emissionsForm.value
    const fuelType = fuelData.fuelType
    const CO2_kg_l = parseFloat(fuelType.CO2_kg_l).toFixed(3);
    const CH4_g_l =  parseFloat(fuelType.CH4_g_l).toFixed(3);
    const N2O_g_l =  parseFloat(fuelType.N2O_g_l).toFixed(3);
    this.emissionsForm.get('defaultEmissionFactor')?.get('co2')?.setValue(CO2_kg_l);
    this.emissionsForm.get('defaultEmissionFactor')?.get('ch4')?.setValue(CH4_g_l);
    this.emissionsForm.get('defaultEmissionFactor')?.get('n2o')?.setValue(N2O_g_l);
    this.emissionsForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.activityData * parseFloat(CO2_kg_l));
    this.emissionsForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.activityData * parseFloat(CH4_g_l));
    this.emissionsForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.activityData * parseFloat(N2O_g_l));
    this.emissionsForm.get('totalEmissions')?.setValue(fuelData.activityData * parseFloat(CO2_kg_l)+fuelData.activityData * parseFloat(CH4_g_l)+fuelData.activityData * parseFloat(N2O_g_l))
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
