import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeakrefrigerantgasesService } from '../../../services/leakrefrigerantgases.service';
import { RegistroemisionesFugasService } from '../../../services/registroemisionesfugas.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MesesService } from '../../../services/meses.service';

@Component({
  selector: 'app-fugitive-gases',
  templateUrl: './fugitive-gases.component.html',
  styleUrl: './fugitive-gases.component.scss'
})
export class FugitiveGasesComponent implements OnInit, OnChanges {
  @Input() activityYear: number = 0
  @Input() productionCenter: number = 0
  displayedColumns: string[] = ['activity Year', 'Period', 'Name of gas mixture', 'gas Equipment Capacity', 'Equipment recharge', 'total Emissions', 'updated At', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emisionesForm!: FormGroup;
  gasTypes: any[] = []
  showField: boolean = false

  constructor(private fb: FormBuilder, private leakGases: LeakrefrigerantgasesService, 
    private registerLeakService: RegistroemisionesFugasService, private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private mesesService: MesesService
  ) {  }

  ngOnInit(): void { 
    this.emisionesForm = this.fb.group({
      periodoFactura: ['', Validators.required],
      nombre_gas_mezcla: ['', Validators.required],
      formulaQuimica: [{ value: '', disabled: true }, Validators.required],
      pca: [{ value: '', disabled: true }, Validators.required],
      capacidad_equipo: [null, [Validators.required, Validators.min(0)]],
      recarga_equipo: [null, [Validators.required, Validators.min(0)]],
      emisionesCO2e: [{ value: 0, disabled: true }]
    });
    this.getGases()
    this.getFugitiveEmisRegisters()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getFugitiveEmisRegisters()
    }
  }

  getGases() {
    this.leakGases.getAll()
      .subscribe((gases:any) => {
      this.gasTypes = gases
      })
  }

  getFugitiveEmisRegisters() {
    this.registerLeakService.getRegistroByFilters(this.activityYear, this.productionCenter)
      .subscribe((registrosleak: any) => {
        const meses = this.mesesService.getMeses(); // Obtener el array de meses
        this.leakGases.getAll().subscribe((gases: any[]) => {
          registrosleak.data.forEach((registro: any) => {
            // Obtener el nombre del mes
            registro.delete = true
            registro['activity Year'] = registro.year
            registro['updated At'] = registro.updated_at
            const matchedMonth = meses.find((mes) => mes.key === registro.periodoFactura);
            registro.periodoFactura = matchedMonth?.value || 'desconocido';
            registro['Period'] = registro.periodoFactura
            // Obtener información del gas
            const matchedGas = gases.find((gas: any) => gas.id === registro.nombre_gas_mezcla);
            console.log ("matchedGas", matchedGas)
            registro.nombre_gas_mezcla = matchedGas?.Nombre || 'desconocido';
            registro['Name of gas mixture'] = registro.nombre_gas_mezcla
            registro.formulaQuimica = matchedGas?.formula || 'desconocido';
            const pca6AR = parseFloat(matchedGas?.PCA_6AR)
            const chemicalFormula = matchedGas?.formulaQuimica
            const recharge = parseFloat(registro.recarga_equipo);
            const capacity = parseFloat(registro.capacidad_equipo);
            registro.PCA_6AR = matchedGas?.PCA_6AR || 0;

            registro['gas Equipment Capacity'] = registro.capacidad_equipo
            registro['Equipment recharge'] = registro.recarga_equipo
            registro['total Emissions'] = "<strong><span ngClass='co2eqData'>"+ (recharge * pca6AR).toFixed(3) + " (tnCO2eq)</span></strong>"
          });

          this.dataSource = new MatTableDataSource(registrosleak.data);
          this.dataSource.paginator = null;
          this.dataSource.sort = null;
        });

        this.dataSource = new MatTableDataSource(registrosleak.data);
        this.dataSource.paginator = null;
        this.dataSource.sort = null;
      });
}



  setPCAAndChemicalFormula() {
    const gasData = this.emisionesForm.value
    const gasType = gasData.nombre_gas_mezcla
    const chemicalFormula = gasType.FormulaQuimica;
    const pca6AR = parseFloat(gasType.PCA_6AR).toFixed(3);
    const equipmentRecharge = gasData.recargaEquipo
    this.emisionesForm.get('formulaQuimica')?.setValue(chemicalFormula);
    this.emisionesForm.get('pca')?.setValue(pca6AR);
    if (equipmentRecharge) {
      this.emisionesForm.get('emisionesCO2e')?.setValue(equipmentRecharge * parseFloat(chemicalFormula)+equipmentRecharge * parseFloat(pca6AR))
    }
  }

  equipmentRechargeChange() {
    const gasData = this.emisionesForm.value
    const equipmentCapacity = gasData.capacidad_equipo
    const equipmentRecharge = gasData.recarga_equipo
    const pca6AR = gasData.nombre_gas_mezcla.PCA_6AR
    const recharge = parseFloat(equipmentRecharge).toFixed(2);
    const capacity = parseFloat(equipmentCapacity).toFixed(2);
    if (recharge > capacity) {
      alert("La recarga no puede ser mayor que la capacidad");
      this.emisionesForm.get('recarga_equipo')?.setValue(0);
      return
    }
    this.emisionesForm.get('emisionesCO2e')?.setValue(parseFloat(recharge) * parseFloat(parseFloat(pca6AR).toFixed(2)))
  }

  onSubmit(): void {
    const formValue = this.emisionesForm.value
    formValue.capacidad_equipo = parseFloat(formValue.capacidad_equipo).toFixed(2);
    formValue.recarga_equipo = parseFloat(formValue.recarga_equipo).toFixed(2);
    formValue.year = this.activityYear;
    formValue.productionCenter = this.productionCenter;
    formValue.activityType = 'fugitive-gases'
    formValue.nombre_gas_mezcla = formValue.nombre_gas_mezcla.id;

     this.registerLeakService.createRegistro(formValue).subscribe({
      next: (response) => { 
        this.showSnackBar(response.message)
        this.emisionesForm.reset()
        this.getFugitiveEmisRegisters()},
      error: (err) => { this.showSnackBar("Error al crear el registro "+err.message) } })

  }

  private showSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 15000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}

