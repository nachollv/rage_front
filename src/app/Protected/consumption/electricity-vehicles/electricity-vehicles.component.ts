import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ScopeTwoRecordsService } from '../../../services/scope-two-records.service';
import { EmisionesElectricasEdificiosService } from '../../../services/emisiones-electricas-edificios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-electricity-vehicles',
  templateUrl: './electricity-vehicles.component.html',
  styleUrl: './electricity-vehicles.component.scss'
})
export class ElectricityVehiclesComponent implements OnInit, OnChanges{
  @Input() activityYear!: number
  @Input() productionCenter: number = 0
  comercializadorasElectricas: any[] = []
  errorMessage: string = ''
  displayedColumns: string[] = ['year', 'periodoFactura', 'energyType', 'activityData', 'updated_at', 'delete']
  data = [{}]; 
  dataSource = new MatTableDataSource<any>(this.data)
  vehiclesElectricity!: FormGroup;

  constructor(private fb: FormBuilder, 
    private scopeTWoRecordsService: ScopeTwoRecordsService,
    private emisionesElectricasservice: EmisionesElectricasEdificiosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.vehiclesElectricity = this.fb.group({
        periodoFactura: ['', Validators.required],
        consumos: this.fb.group({
          comercializadora: ['', [Validators.required]],
          fe_co2: [{ value: null, disabled: true }],
          activityData: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
          factorMixElectrico : [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
          gdo: ['', [Validators.required]]
        }),
        emisionesCO2e: [{ value: 0, disabled: true }] 
      });
      this.getScopeTwoRecords()
      this.getAllEmissionsbyYear(this.activityYear)
      this.setupListeners()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getAllEmissionsbyYear(this.activityYear);
    }
  }
  getAllEmissionsbyYear(year:number): void {
    this.emisionesElectricasservice.getByYear(year).subscribe({
      next: (data) => {
        this.comercializadorasElectricas = data;
        console.log('Emisiones obtenidas:', this.comercializadorasElectricas);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('Error al obtener las emisiones:', error);
      }
    });
  }

  getScopeTwoRecords() {
    this.scopeTWoRecordsService.getRecordsByFilters(this.activityYear, this.productionCenter, 'electricityVehicles')
    .subscribe({
      next: (itemsElectricity: any) => {
        this.emisionesElectricasservice.getByYear(this.activityYear)
          .subscribe((comercializadora:any) => {
            this.comercializadorasElectricas = comercializadora
            itemsElectricity.data.forEach((registro: any) => {
              registro.delete = true
              const matchedComercializadora = this.comercializadorasElectricas.find((comercializadoraItem: any) => comercializadoraItem.id === registro.electricityTradingCompany);
              registro.electricityTradingCompany = matchedComercializadora?.nombreComercial || 'desconocido';
            })

          })
        this.dataSource = new MatTableDataSource(itemsElectricity.data)
      },
      error: (err: any) => {
        this.showSnackBar('Error al obtener los registros ' + err.messages?.error || err.message)
      }
    });
  }

  onComercializadoraChange(comercializadora: any): void {
    const consumosGroup = this.vehiclesElectricity.get('consumos') as FormGroup;
    if (consumosGroup) {
      consumosGroup.get('fe_co2')?.setValue(comercializadora.kg_CO2_kWh);
    }
  }

  onGdoChange(value: string): void {
    const consumosGroup = this.vehiclesElectricity.get('consumos') as FormGroup;
    if (consumosGroup) {
      consumosGroup.get('factorMixElectrico')?.setValue(value);
    }
  }

  setupListeners(): void {
    const consumosGroup = this.vehiclesElectricity.get('consumos') as FormGroup;
    if (consumosGroup) {
      // Función para calcular emisiones
      const calculateEmisionesCO2e = () => {
        const activityData = consumosGroup.get('activityData')?.value || 0;
        const factorMixElectrico = consumosGroup.get('factorMixElectrico')?.value || 0;
        const fe_co2 = +factorMixElectrico === 0.302 ? 1.0 : consumosGroup.get('fe_co2')?.value || 0;
        const emisionesCO2e = (activityData * factorMixElectrico * fe_co2) / 1000;
  
        this.vehiclesElectricity.get('emisionesCO2e')?.setValue(emisionesCO2e.toFixed(3));
      };
  
      // Observadores para recalcular emisiones al cambiar cualquier campo relevante
      const relevantFields = ['activityData', 'comercializadora', 'gdo', 'factorMixElectrico', 'fe_co2'];
  
      relevantFields.forEach((fieldName) => {
        consumosGroup.get(fieldName)?.valueChanges.subscribe({
          next: () => calculateEmisionesCO2e(),
          error: (err) => console.error(`Error en el campo ${fieldName}:`, err),
        });
      });
    }
  }

  // Método para enviar el formulario
  onSubmit() {
    const formValue = this.vehiclesElectricity.value
    console.log('Form Value:', formValue); // Imprime el valor del formulario

    formValue.year = this.activityYear
    formValue.productionCenter = this.productionCenter
    formValue.activityType = 'electricityVehicles' // Tipo de actividad
    formValue.periodoFactura = formValue.periodoFactura // Asigna el periodo de factura
    this.vehiclesElectricity.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
    this.scopeTWoRecordsService.createConsumption(this.vehiclesElectricity.value).subscribe({
      next: (response) => { 
        this.showSnackBar(response.message); // Imprime la respuesta del servidor
        this.getScopeTwoRecords(); // Actualiza la tabla después de crear un nuevo registro
        this.dataSource.data.push(response); // Agrega el nuevo registro a la tabla
        this.dataSource._updateChangeSubscription(); // Actualiza la fuente de datos de la tabla
        this.vehiclesElectricity.reset(); // Resetea el formulario después de enviar
      },
      error: (error) => {   
        this.showSnackBar(error.message); // Manejo de errores
      }
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
