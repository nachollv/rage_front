import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  emissionsForm!: FormGroup;
  showField: boolean = false
  displayedColumns: string[] = ['year', 'productionCenter', 'fuelType', 'quantity', 'edit', 'delete']
  data = [{ }]
  fuelEmisTypes: any[] = []
  dataSource = new MatTableDataSource<any>(this.data)

  constructor( private fb: FormBuilder,
      private emisionesMachineryService: EmisionesMachineryService,
      private snackBar: MatSnackBar,
      private scopeOneRecordsService: ScopeOneRecordsService,
      ) { }

  ngOnInit(): void { 
    this.emissionsForm = this.fb.group({
      rows: this.fb.array([this.createRow()]), // Inicializa con una fila vacía
    });
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
              console.log('registros: ', registros.data)
              registros.data.forEach((registro: any) => {
                registro.edit = true
                registro.delete = true
                //registro.fuelType = this.machineryEmisTypes.find((fuelType: any) => fuelType.id === registro.fuelType)?.Combustible || 'desconocido'
  
              })
              this.dataSource = new MatTableDataSource(registros.data)
              this.showSnackBar('Registros obtenidos transferma: ' + registros.data.length)
            },
            error: (err: any) => {
              this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
            }
          });
  }

  createRow(): FormGroup {
    return this.fb.group({
      productionCenter: [{ value: '6', disabled: true }],
      machineryType: [''], // Tipo de maquinaria
      fuelType: [''], // Tipo de Combustible o lubricante
      quantity: [''], // Cantidad (ud)
      defaultEmissionFactor: this.fb.group({
        co2: [''], // kg CO₂/ud
        ch4: [''], // g CH₄/ud
        n2o: [''], // g N₂O/ud
      }),
      otherEmissionFactor: this.fb.group({
        co2: [''], // Otros: kg CO₂/ud
        ch4: [''], // Otros: g CH₄/ud
        n2o: [''], // Otros: g N₂O/ud
      }),
      partialEmissions: this.fb.group({
        co2: [{ value: '', disabled: true }], // Emisiones parciales C: kg CO₂
        ch4: [{ value: '', disabled: true }], // Emisiones parciales C: g CH₄
        n2o: [{ value: '', disabled: true }], // Emisiones parciales C: g N₂O
      }),
      totalEmissions: [{ value: '', disabled: true }], // Emisiones totales C: kg CO₂e
    });
  }

  get rows(): FormArray {
    return this.emissionsForm.get('rows') as FormArray;
  }

  addRow(): void {
    this.rows.push(this.createRow());
  }

  calculateEmissions(index: number): void {
    const row = this.rows.at(index);
    const quantity = row.get('quantity')?.value;
    const defaultFactors = row.get('defaultEmissionFactor')?.value;
    const partialEmissions = row.get('partialEmissions') as FormGroup;

    if (quantity && defaultFactors) {
      const co2 = quantity * defaultFactors.co2;
      const ch4 = quantity * defaultFactors.ch4;
      const n2o = quantity * defaultFactors.n2o;

      partialEmissions.get('co2')?.setValue(co2.toFixed(2));
      partialEmissions.get('ch4')?.setValue(ch4.toFixed(2));
      partialEmissions.get('n2o')?.setValue(n2o.toFixed(2));

      const total = co2 + ch4 / 1000 + n2o / 1000; // Conversión de CH₄ y N₂O a kg CO₂e
      row.get('totalEmissions')?.setValue(total.toFixed(2));
    } else {
      partialEmissions.reset();
      row.get('totalEmissions')?.setValue('');
    }
  }

  onSubmit(): void {
    console.log(this.emissionsForm.value);
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
      console.log("tipos de emisiones: ",this.fuelEmisTypes)
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
