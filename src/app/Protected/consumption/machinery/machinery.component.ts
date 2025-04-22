import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesMachineryService } from '../../../services/emisiones-machinery.service';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  displayedColumns: string[] = ['year', 'categoria', 'fuelType', 'quantity', 'updated_at', 'edit', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  fuelEmisTypes: any[] = []

  constructor( private fb: FormBuilder,
      private emisionesMachineryService: EmisionesMachineryService,
      private snackBar: MatSnackBar,
      private scopeOneRecordsService: ScopeOneRecordsService,
      ) { }

  ngOnInit(): void { 
    this.emissionsForm = this.fb.group({
           year: [{ value: this.activityYear, disabled: true }],
           productionCenter: [{value: this.productionCenter, disabled: true}],
           machineryType: ['', Validators.required],
           fuelType: ['', Validators.required],
           quantity: ['', [Validators.required, Validators.min(0)]],
           defaultEmissionFactor: this.fb.group({
             co2: [{ value: '', disabled: true }, Validators.required],
             ch4: [{ value: '', disabled: true }, Validators.required],
             n2o: [{ value: '', disabled: true }, Validators.required]
           }),
           partialEmissions: this.fb.group({
             co2: [{ value: '', disabled: true }, Validators.required],
             ch4: [{ value: '', disabled: true }, Validators.required],
             n2o: [{ value: '', disabled: true }, Validators.required]
           }),
           totalEmissions: [{ value: '', disabled: true }]
         });
         this.getScopeOneRecords()
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
                registros.data.forEach((registro: any) => {
                  registro.edit = true
                  registro.delete = true
                  //registro.fuelType = this.fuelEmisTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType)?.FuelType || 'desconocido';
                  const matchedFuel = this.fuelEmisTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                  registro.fuelType = matchedFuel?.FuelType || 'desconocido';
                  registro.categoria = matchedFuel?.Categoria || 'desconocido';
                })
                this.dataSource = new MatTableDataSource(registros.data)
                this.showSnackBar('Registros obtenidos maquinaria: ' + registros.data.length)
              })
            },
            error: (err: any) => {
              this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
            }
          });
  }

  onSubmit(): void {
    const formValue = this.emissionsForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.activityType = 'machinery'
    console.log("formValue: ", formValue)

    this.scopeOneRecordsService.createRecord(formValue)
      .subscribe(
        (result: any) => {
          this.showSnackBar('Éxito:' + result);
          this.getScopeOneRecords(this.activityYear, this.productionCenter, 'machinery')
          //this.emissionsForm.reset()
        },
        (error: any) => {
          this.showSnackBar('Error al crear:' + error);
      }
      );
  }

  onMachineryChange(selectedMachinery: string): void {
    this.getFuelEmissions(this.activityYear, selectedMachinery)
  }

  onQuantityChange() {
    if (this.emissionsForm.valid) {
      const fuelData = this.emissionsForm.value
      const fuelType = fuelData.fuelType
      const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
      const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
      const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
      this.emissionsForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity * CO2_kg_ud);
      this.emissionsForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * CH4_g_ud);
      this.emissionsForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * N2O_g_ud);
      this.emissionsForm.get('totalEmissions')?.setValue(fuelData.quantity * CO2_kg_ud+fuelData.quantity * CH4_g_ud+fuelData.quantity * N2O_g_ud)
    }
  }

  getFuelEmissions(year: number, selectedTransport: string) {
    this.fuelEmisTypes = [] // Reiniciar el array de tipos de combustible
    this.emisionesMachineryService.getEmisionesByYear(year)
    .subscribe((emissions:any) => {
      this.fuelEmisTypes = emissions
      this.fuelEmisTypes = this.fuelEmisTypes.filter((fuelType: any) => fuelType.UsageType === selectedTransport)
    })
  }

  setEmissionFactors () {
    const fuelData = this.emissionsForm.value
    const fuelType = fuelData.fuelType
    const CO2_kg_ud = parseFloat(fuelType.CO2_kg_ud).toFixed(3);
    const CH4_g_ud = parseFloat(fuelType.CH4_g_ud).toFixed(3);
    const N2O_g_ud = parseFloat(fuelType.N2O_g_ud).toFixed(3);
    this.emissionsForm.get('defaultEmissionFactor')?.get('co2')?.setValue(CO2_kg_ud);
    this.emissionsForm.get('defaultEmissionFactor')?.get('ch4')?.setValue(CH4_g_ud);
    this.emissionsForm.get('defaultEmissionFactor')?.get('n2o')?.setValue(N2O_g_ud);
    this.emissionsForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity *  parseFloat(CO2_kg_ud));
    this.emissionsForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * parseFloat(CH4_g_ud));
    this.emissionsForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * parseFloat(N2O_g_ud));
    this.emissionsForm.get('totalEmissions')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud)+fuelData.quantity * parseFloat(CH4_g_ud)+fuelData.quantity * parseFloat(N2O_g_ud))
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
