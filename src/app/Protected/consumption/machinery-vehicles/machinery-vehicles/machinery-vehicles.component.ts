import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuelDataService } from '../../../../services/fuel-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-machinery-vehicles',
  templateUrl: './machinery-vehicles.component.html',
  styleUrls: ['./machinery-vehicles.component.css']
})
export class MachineryVehiclesComponent implements OnInit {
    displayedColumns: string[] = ['delegation', 'year', 'tipoCombustible', 'kg_CO2_ud_defecto', 'gCH4_ud_defecto', 'gN2O_ud_defecto', 'g CO2_ud_otros', 'gCH4_ud_otros', 'gN2O_ud_otros', 'kg__CO2', 'g_CH4', 'g_N2O', 'kg__CO2e', 'edit', 'delete']
      data = [
        { delegation: 'Central', year: 2024, tipoCombustible: 'Gas propano (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
        { delegation: 'Felanitx', year: 2024, tipoCombustible: 'Biogás (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
        { delegation: 'Manacor', year: 2024, tipoCombustible: 'Biomasa madera (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},  
        { delegation: 'Calvià', year: 2024, tipoCombustible: 'Carbón vegetal (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
        { delegation: 'Andraitx', year: 2024, tipoCombustible: 'Hulla y antracita (kg)', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
        { delegation: 'Pollença', year: 2024, tipoCombustible: 'Gasólea A', 'kg_CO2_ud_defecto': 25, 'gCH4_ud_defecto': 34.25, 'gN2O_ud_defecto': 23.54, 'kg_CO2_ud_otros': 45.345, 'gCH4_ud_otros': 0.00, 'gN2O_ud_otros': 0.00, 'kg__CO2': 0.12, 'g_CH4':12.23, 'g_N2O': 25.21, 'kg__CO2e':154.24, edit: true, delete: true},
      ];
      dataSource = new MatTableDataSource<any>(this.data)
      fuelTypes: string[] = ['Gasóleo C (l)', 'Gasóleo B (l)', 'Gas natural (kWhPCS)*', 
        'Fuelóleo (l)', 'LPG (l)', 'Queroseno (l)', 'Gas propano (kg)', 'Gas butano (kg)', 
        'Gas manufacturado (kg)', 'Biogás (kg)**', 'Biomasa madera (kg)**', 'Biomasa pellets (kg)**', 
        'Biomasa astillas (kg)**', 'Biomasa serrines virutas (kg)**', 'Biomasa cáscara f. secos (kg)**', 
        'Biomasa hueso aceituna (kg)**', 'Carbón vegetal (kg)**', 'Coque de petróleo (kg)', 'Coque de carbón (kg)', 
        'Hulla y antracita (kg)', 'Hullas subituminosas (kg)', 'Gasóleo A (l)', 'Gasolina  (l)'];
  machineryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.machineryForm = this.fb.group({
      building: ['', Validators.required],
      vehicleCategory: ['', Validators.required],
      fuelType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      defaultEmissionFactor: this.fb.group({
        co2: ['', Validators.required],
        ch4: ['', Validators.required],
        n2o: ['', Validators.required]
      }),
      otherEmissionFactor: this.fb.group({
        co2: [''],
        ch4: [''],
        n2o: ['']
      }),
      partialEmissions: this.fb.group({
        co2: [{ value: '', disabled: true }],
        ch4: [{ value: '', disabled: true }],
        n2o: [{ value: '', disabled: true }]
      }),
      totalEmissions: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    
  }

  calculateEmissions(): void {
    const formValues = this.machineryForm.value;
    const quantity = formValues.quantity;
    const defaultFactors = formValues.defaultEmissionFactor;
    const otherFactors = formValues.otherEmissionFactor;

    const co2 = quantity * (otherFactors.co2 || defaultFactors.co2);
    const ch4 = quantity * (otherFactors.ch4 || defaultFactors.ch4);
    const n2o = quantity * (otherFactors.n2o || defaultFactors.n2o);

    this.machineryForm.patchValue({
      partialEmissions: { co2, ch4, n2o },
      totalEmissions: co2 + ch4 + n2o
    });
  }
}