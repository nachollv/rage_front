import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmisionesCombustibles, FuelDataService } from '../../../services/fuel-data.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fuel-emission-factor-maintenance',
  templateUrl: './fuel-emission-factor-maintenance.component.html',
  styleUrl: './fuel-emission-factor-maintenance.component.scss'
})
export class FuelEmissionFactorMaintenanceComponent {
  displayedColumns: string[] = ['year', 'Combustible', 'CH4_g_ud', 'CO2_kg_ud', 'N2O_g_ud', 'delete']
  data = [{ }]
  dataSource = new MatTableDataSource<any>(this.data)
  emissionForm: FormGroup;
  submitted = false;
  loading = false;
  fuelTypes: any[] = []

  constructor(private fb: FormBuilder, private fuelDataService: FuelDataService) {
    this.emissionForm = this.fb.group({
      combustible: ['', Validators.required],
      anio: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      co2_kg_ud: ['', [Validators.required, Validators.min(0)]],
      ch4_g_ud: ['', [Validators.required, Validators.min(0)]],
      n2o_g_ud: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required]
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

    const formData: EmisionesCombustibles = {
      id: 0,  // Se generará en el servidor
      ...this.emissionForm.value
    };

    this.fuelDataService.create(formData).subscribe({
      next: () => {
        alert('Emisión registrada correctamente.');
        this.emissionForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al registrar la emisión', err);
        alert('Error al registrar la emisión.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getFuelConsumptions() {
    this.fuelDataService.getAll()
    .subscribe((fuel:any) => {
      this.fuelTypes = fuel
      console.log (this.fuelTypes)
      this.dataSource = new MatTableDataSource(this.fuelTypes)
    })
  }
}
