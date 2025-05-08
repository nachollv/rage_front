import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EmisionesMachineryService, machineryEmissions } from '../../../services/emisiones-machinery.service';


@Component({
  selector: 'app-machinery-emission-factor-maintenance',
  templateUrl: './machinery-emission-factor-maintenance.component.html',
  styleUrl: './machinery-emission-factor-maintenance.component.scss'
})
export class MachineryEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['year', 'Categoria', 'FuelType', 'CO2_kg_l', 'N2O_g_l', 'CH4_g_l', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  machineryEmissions: any[] = []
  
  constructor(private fb: FormBuilder, private machineryEmissionsService: EmisionesMachineryService,
    private snackBar: MatSnackBar) {
      this.emissionForm = this.fb.group({
        FuelType: ['', Validators.required],
        Categoria: ['', Validators.required],
        year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
        CO2_kg_ud: ['', [Validators.required, Validators.min(0)]],
        CH4_g_ud: ['', [Validators.required, Validators.min(0)]],
        N2O_g_ud: ['', [Validators.required, Validators.min(0)]],
      });
    }

  ngOnInit(): void {
    this.getMachineryEmissions()
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.emissionForm.invalid) {
       return;
    }
      
    this.loading = true;
      
    const formData: machineryEmissions = {
      id: 0,  // Se generará en el servidor
        ...this.emissionForm.value
      };
      
      this.machineryEmissionsService.createEmision(formData).subscribe({
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

  getMachineryEmissions() {
    this.machineryEmissionsService.getEmisiones()
    .subscribe((machinery:any) => {
      this.machineryEmissions = machinery
      console.log ("this.machineryEmissions", this.machineryEmissions)
      this.dataSource = new MatTableDataSource(this.machineryEmissions)
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
