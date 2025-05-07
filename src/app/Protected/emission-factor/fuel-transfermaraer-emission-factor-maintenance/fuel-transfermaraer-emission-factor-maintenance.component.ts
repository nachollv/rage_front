import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesCombustiblesTransFerMarAer, EmisionesTransFerAerMarService } from '../../../services/emisiones-trans-feraermar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fuel-transfermaraer-emission-factor-maintenance',
  templateUrl: './fuel-transfermaraer-emission-factor-maintenance.component.html',
  styleUrl: './fuel-transfermaraer-emission-factor-maintenance.component.scss'
})

export class FuelTransfermaraerEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['year', 'FuelType', 'Categoria', 'CH4_g_ud', 'CO2_kg_ud', 'N2O_g_ud', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  fuelTypes: any[] = []

  constructor(private fb: FormBuilder, private transFerAerMarService: EmisionesTransFerAerMarService,
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
    this.getFuelConsumptions()
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.emissionForm.invalid) {
      return;
    }

    this.loading = true;

    const formData: EmisionesCombustiblesTransFerMarAer = {
      id: 0,  // Se generará en el servidor
      ...this.emissionForm.value
    };

    this.transFerAerMarService.createEmision(formData).subscribe({
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

  getFuelConsumptions() {
    this.transFerAerMarService.getEmisiones()
    .subscribe((fuel:any) => {
      this.fuelTypes = fuel
      this.dataSource = new MatTableDataSource(this.fuelTypes)
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
