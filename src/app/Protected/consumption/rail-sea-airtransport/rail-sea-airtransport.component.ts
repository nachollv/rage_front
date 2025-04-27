import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesTransFerAerMarService } from '../../../services/emisiones-trans-feraermar.service';
import { ScopeOneRecordsService } from '../../../services/scope-one-records.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rail-sea-airtransport',
  templateUrl: './rail-sea-airtransport.component.html',
  styleUrl: './rail-sea-airtransport.component.scss'
})
export class RailSeaAirtransportComponent  implements OnInit, OnChanges {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  transportForm!: FormGroup
  showField: boolean = false
  displayedColumns: string[] = ['year', 'categoria', 'fuelType', 'quantity', 'updated_at', 'edit', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  fuelEmisTypes: any[] = []

  constructor( private fb: FormBuilder,
      private emisionesTransFerAerMarService: EmisionesTransFerAerMarService,
      private snackBar: MatSnackBar,
      private scopeOneRecordsService: ScopeOneRecordsService,
      ) { }

  ngOnInit(): void {
    this.transportForm = this.fb.group({
      year: [{ value: this.activityYear, disabled: true }],
      productionCenter: [{value: this.productionCenter, disabled: true}],
      periodoFactura: ['', Validators.required],
      equipmentType: ['', Validators.required],
      transportType: ['', Validators.required],
      fuelType: ['', Validators.required],
      fuelQuantity: ['', [Validators.required, Validators.min(0)]],
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
    this.getScopeOneRecords()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeOneRecords(this.activityYear, this.productionCenter)
    }
  }

  getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, activityType: string = 'transferma') {
      this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, activityType)
        .subscribe({
          next: (registros: any) => {
            this.emisionesTransFerAerMarService.getEmisionesByYear(calculationYear)
            .subscribe((emissions:any) => {
              this.fuelEmisTypes = emissions
              registros.data.forEach((registro: any) => {
                registro.edit = true
                registro.delete = true
                const matchedFuel = this.fuelEmisTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                registro.fuelType = matchedFuel?.FuelType || 'desconocido';
                registro.categoria = matchedFuel?.Categoria || 'desconocido';
              })
            this.dataSource = new MatTableDataSource(registros.data)
            //this.showSnackBar('Registros obtenidos transferma: ' + registros.data.length)
            })
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
          }
        });
  }


  onSubmit(): void {
    const formValue = this.transportForm.value
    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.fuelType = this.transportForm.get('fuelType')?.value.id
    formValue.activityType = 'rail-sea-air-transport'
    formValue.quantity = this.transportForm.get('quantity')?.value

    this.scopeOneRecordsService.createRecord(formValue)
      .subscribe(
        (fuel: any) => {
          this.showSnackBar('Éxito:' + fuel);
          this.getScopeOneRecords(this.activityYear, this.productionCenter, 'transferma')
          this.transportForm.reset()
        },
        (error: any) => {
          this.showSnackBar('Error al crear:' + error);
      }
      );
  }

  onTransportChange(selectedTransport: string): void {
    this.getFuelEmissions(this.activityYear, selectedTransport)
  }

  setEmissionFactors () {
    const fuelData = this.transportForm.value
    const fuelType = fuelData.fuelType
    const CO2_kg_ud = parseFloat(fuelType.CO2_kg_ud  || 0).toFixed(3);
    const CH4_g_ud =  parseFloat(fuelType.CH4_g_ud  || 0).toFixed(3);
    const N2O_g_ud =  parseFloat(fuelType.N2O_g_ud  || 0).toFixed(3);
    this.transportForm.get('defaultEmissionFactor')?.get('co2')?.setValue(CO2_kg_ud || 0);
    this.transportForm.get('defaultEmissionFactor')?.get('ch4')?.setValue(CH4_g_ud  || 0);
    this.transportForm.get('defaultEmissionFactor')?.get('n2o')?.setValue(N2O_g_ud  || 0);
    this.transportForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud));
    this.transportForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * parseFloat(CH4_g_ud));
    this.transportForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * parseFloat(N2O_g_ud));
    this.transportForm.get('totalEmissions')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud)+fuelData.quantity * parseFloat(CH4_g_ud)+fuelData.quantity * parseFloat(N2O_g_ud))
  }

  onQuantityChange() {
      const fuelData = this.transportForm.value
      const fuelType = fuelData.fuelType
      const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
      const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
      const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
      this.transportForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.fuelQuantity * CO2_kg_ud);
      this.transportForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.fuelQuantity * CH4_g_ud);
      this.transportForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.fuelQuantity * N2O_g_ud);
      this.transportForm.get('totalEmissions')?.setValue(fuelData.fuelQuantity * CO2_kg_ud+fuelData.fuelQuantity * CH4_g_ud+fuelData.fuelQuantity * N2O_g_ud)
  }

  getFuelEmissions(year: number, selectedTransport: string) {
    this.fuelEmisTypes = [] // Reiniciar el array de tipos de combustible
    this.emisionesTransFerAerMarService.getEmisionesByYear(year)
    .subscribe((emissions:any) => {
      this.fuelEmisTypes = emissions
      console.log('emissions: ', this.fuelEmisTypes)
      this.fuelEmisTypes = this.fuelEmisTypes.filter((fuelType: any) => fuelType.Categoria === selectedTransport)
    })
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

