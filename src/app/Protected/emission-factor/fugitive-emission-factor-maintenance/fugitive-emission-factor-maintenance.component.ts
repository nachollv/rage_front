import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeakrefrigerantgasesService, EmisionesLeakRefrigerantGases } from '../../../services/leakrefrigerantgases.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fugitive-emission-factor-maintenance',
  templateUrl: './fugitive-emission-factor-maintenance.component.html',
  styleUrl: './fugitive-emission-factor-maintenance.component.scss'
})
export class FugitiveEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['Nombre del gas o de la mezcla', 'Fórmula química', 'PCA', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  feGases: EmisionesLeakRefrigerantGases[] = []

    constructor(private fb: FormBuilder, private leakRefrigerantGasesService: LeakrefrigerantgasesService,
      private snackBar: MatSnackBar) {
        this.emissionForm = this.fb.group({
          Nombre: ['', Validators.required],
          FormulaQuimica: ['', Validators.required],
          PCA_6AR: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]]
        });        
    }

    ngOnInit(): void {
      this.getLeakGases()
    }
    
      onSubmit(): void {
        this.submitted = true;
        if (this.emissionForm.invalid) {
          return;
        }
    
        this.loading = true;
    
        const formData: EmisionesLeakRefrigerantGases = {
          id: 0,  // Se generará en el servidor
          ...this.emissionForm.value
        };
    
        this.leakRefrigerantGasesService.create(formData).subscribe({
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
    
      getLeakGases() {
        this.leakRefrigerantGasesService.getAll()
        .subscribe((traders:EmisionesLeakRefrigerantGases[]) => {
          this.feGases = traders
          this.feGases.forEach((registro: any) => {
            registro.delete = true
            registro['Nombre del gas o de la mezcla'] = registro.Nombre
            registro['Fórmula química'] = registro.FormulaQuimica
            registro['PCA'] = registro.PCA_6AR
          })
          this.dataSource = new MatTableDataSource(this.feGases)
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
