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
  displayedColumns: string[] = ['year', 'productionCenter', 'fuel_type', 'quantity', 'edit', 'delete']
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
      transportType: ['', Validators.required],
      fuelType: ['', Validators.required],
      fuelQuantity: ['', [Validators.required, Validators.min(0)]],
      defaultEmissionFactor: this.fb.group({
        co2: [0, Validators.required],
        ch4: [0, Validators.required],
        n2o: [0, Validators.required]
      }),
      partialEmissions: this.fb.group({
        co2: [0, Validators.required],
        ch4: [0, Validators.required],
        n2o: [0, Validators.required]
      }),
      totalEmissions: [0, Validators.required]
    });
    this.getFuelEmissions(this.activityYear)
    this.getScopeOneRecords()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getScopeOneRecords(this.activityYear, this.productionCenter)
    }
  }

  getFuelEmissions(year: number) {
    this.emisionesTransFerAerMarService.getEmisionesByYear(year)
    .subscribe((emissions:any) => {
      this.fuelEmisTypes = emissions
      console.log('Emisiones de combustibles:', this.fuelEmisTypes)
    })
  }

  getScopeOneRecords(calculationYear: number = this.activityYear, productionCenter: number = this.productionCenter, activityType: string = 'transfermaraer') {
      this.scopeOneRecordsService.getRecordsByFilters(calculationYear, productionCenter, activityType)
        .subscribe({
          next: (registros: any) => {
            registros.data.forEach((registro: any) => {
              registro.edit = true
              registro.delete = true
              registro.fuel_type = this.fuelEmisTypes.find((fuelType: any) => fuelType.id === registro.fuel_type)?.Combustible || 'desconocido'
            })
            this.dataSource = new MatTableDataSource(registros.data)
            this.showSnackBar('Registros obtenidos fixed: ' + registros.data.length)
          },
          error: (err: any) => {
            this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
          }
        });
  }

  calculateEmissions(): void {
    const formValue = this.transportForm.value
    const quantity = formValue.get('fuelQuantity')?.value;
    const defaultFactors = formValue.get('defaultEmissionFactor')?.value;
    const partialEmissions = formValue.get('partialEmissions') as FormGroup;

    if (quantity && defaultFactors) {
      const co2 = quantity * defaultFactors.co2;
      const ch4 = quantity * defaultFactors.ch4;
      const n2o = quantity * defaultFactors.n2o;

      partialEmissions.get('co2')?.setValue(co2.toFixed(2));
      partialEmissions.get('ch4')?.setValue(ch4.toFixed(2));
      partialEmissions.get('n2o')?.setValue(n2o.toFixed(2));

      const total = co2 + ch4 / 1000 + n2o / 1000; // Conversión de CH₄ y N₂O a kg CO₂e
      formValue.get('totalEmissions')?.setValue(total.toFixed(2));
    } else {
      partialEmissions.reset();
      formValue.get('totalEmissions')?.setValue('');
    }
  }

  onSubmit(): void {
    console.log(this.transportForm.value);
  }

  onTransportChange(): void {
    const tipoSeleccionado = this.transportForm.get('transportType')?.value;
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

