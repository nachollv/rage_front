import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesComercializadoraElectrica, EmisionesElectricaComercializadorasService } from '../../../services/emisiones-electricas-comercializadoras.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-electrical-traders-emission-factor-maintenance',
  templateUrl: './electrical-traders-emission-factor-maintenance.component.html',
  styleUrl: './electrical-traders-emission-factor-maintenance.component.scss'
})

export class ElectricalTradersEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['Año actividad', 'Comercializadora', 'kg CO₂/kWh', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  electrTraders: any[] = []

  constructor(private fb: FormBuilder, private comercializadoraElectricaService: EmisionesElectricaComercializadorasService,
    private snackBar: MatSnackBar) {
    this.emissionForm = this.fb.group({
      nombreComercial: ['', Validators.required],
      kg_CO2_kWh: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    });
  }

  ngOnInit(): void {
    this.getElectricalTraders()
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.emissionForm.invalid) {
      return;
    }

    this.loading = true;

    const formData: EmisionesComercializadoraElectrica = {
      id: 0,  // Se generará en el servidor
      ...this.emissionForm.value
    };

    this.comercializadoraElectricaService.create(formData).subscribe({
      next: () => {
        this.showSnackBar ('Factor de Emisión registrado correctamente.')
        this.emissionForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al registrar la emisión', err);
        this.showSnackBar ('Error al registrar el factor de emisión. '+err)
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getElectricalTraders() {
    this.comercializadoraElectricaService.getAll()
    .subscribe((traders:any) => {
      this.electrTraders = traders
      this.electrTraders.forEach((registro: any) => {
        registro.delete = true
        registro['Año actividad'] = registro.year
        registro['Comercializadora'] = registro.nombreComercial
        registro['kg CO₂/kWh'] = registro.kg_CO2_kWh // Se usa el subíndice Unicode '₂'
      })
      this.dataSource = new MatTableDataSource(this.electrTraders)
    })
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.emissionForm.controls).forEach(key => {
      const controlErrors = this.emissionForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          errors.push(`Error en ${key}: ${this.getErrorMessage(errorKey, key)}`);
        });
      }
    });
    return errors;
  }

  getErrorMessage(errorType: string, fieldName: string): string {
    const errorMessages: { [key: string]: string } = {
      required: `${fieldName} es obligatorio.`,
      pattern: `${fieldName} debe tener el formato correcto.`,
      min: `${fieldName} debe ser un número positivo.`,
    };
    return errorMessages[errorType] || 'Error desconocido.';
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
