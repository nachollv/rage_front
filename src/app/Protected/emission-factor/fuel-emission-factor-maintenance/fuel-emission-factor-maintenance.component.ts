import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesCombustibles, FuelDataService } from '../../../services/fuel-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fuel-emission-factor-maintenance',
  templateUrl: './fuel-emission-factor-maintenance.component.html',
  styleUrl: './fuel-emission-factor-maintenance.component.scss'
})
export class FuelEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['Año actividad', 'Tipo de combustible', 'kg CO₂/ud', 'g CH₄/ud', 'g N₂O/ud', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  fuelTypes: EmisionesCombustibles[] = []

  constructor(private fb: FormBuilder, private fuelDataService: FuelDataService,
    private snackBar: MatSnackBar) {
    this.emissionForm = this.fb.group({
      Combustible: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      CO2_kg_ud: ['', [Validators.required, Validators.min(0)]],
      CH4_g_ud: ['', [Validators.required, Validators.min(0)]],
      N2O_g_ud: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getFuelEmissions()
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.emissionForm.invalid) {
      return;
    }

    this.loading = true;

    const formData: EmisionesCombustibles = {
      id: 0,  // Se generará en el servidor
      ...this.emissionForm.value
    };

    this.fuelDataService.create(formData).subscribe({
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

  getFuelEmissions() {
    this.fuelDataService.getAll()
    .subscribe((fuel: EmisionesCombustibles[]) => {
      this.fuelTypes = fuel
      this.fuelTypes.forEach((registro: any) => {
        registro.delete = true
        registro['Año actividad'] = registro.year
        registro['Tipo de combustible'] = registro.Combustible
        registro['kg CO₂/ud'] = registro.CO2_kg_ud // Se usa el subíndice Unicode '₂'
        registro['g CH₄/ud'] = registro.CH4_g_ud // También aplicando subíndice en CH₄
        registro['g N₂O/ud'] = registro.N2O_g_ud // Aplicando subíndice en N₂O
      })
      this.dataSource = new MatTableDataSource(this.fuelTypes)
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
