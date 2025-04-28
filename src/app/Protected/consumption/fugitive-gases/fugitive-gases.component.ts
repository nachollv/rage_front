import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeakrefrigerantgasesService } from '../../../services/leakrefrigerantgases.service';
import { RegistroemisionesFugasService } from '../../../services/registroemisionesfugas.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fugitive-gases',
  templateUrl: './fugitive-gases.component.html',
  styleUrl: './fugitive-gases.component.scss'
})
export class FugitiveGasesComponent implements OnInit, OnChanges {
  @Input() activityYear: number = 0
  @Input() productionCenter: number = 0
  displayedColumns: string[] = ['year', 'periodoFactura', 'nombre_gas_mezcla', 'capacidad_equipo', 'recarga_equipo', 'updated_at', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emisionesForm!: FormGroup;
  gasTypes: any[] = []
  showField: boolean = false

  constructor(private fb: FormBuilder, private leakGases: LeakrefrigerantgasesService, 
    private registerLeakService: RegistroemisionesFugasService, private dialog: MatDialog,
    private snackBar: MatSnackBar) {  }

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
    this.getregistros()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityYear'] && !changes['activityYear'].firstChange) {
      this.getregistros()
    }
  }

  getGases() {
    this.leakGases.getAll()
      .subscribe((gases:any) => {
      this.gasTypes = gases
      })
  }

  getregistros() {
    this.registerLeakService.getRegistroByFilters(this.activityYear, this.productionCenter)
      .subscribe((registrosleak:any) => {
        this.dataSource = new MatTableDataSource(registrosleak.data)
      this.dataSource.paginator = null
      //this.showSnackBar('Registros leak obtenidos: ' + registrosleak.length)
      })
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

  equipmentRecharge() {
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
        this.getregistros()},
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

