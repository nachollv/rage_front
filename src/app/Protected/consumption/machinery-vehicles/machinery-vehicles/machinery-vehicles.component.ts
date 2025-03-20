import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiclesFuelConsumptionService } from '../../../../services/vehicles-fuel-consumption.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-machinery-vehicles',
  templateUrl: './machinery-vehicles.component.html',
  styleUrls: ['./machinery-vehicles.component.scss']
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
      vehicleTypes: any[] = []
      fuelTypes: any[] = []
      machineryForm: FormGroup;

  constructor(private fb: FormBuilder, private vehicleFuelService: VehiclesFuelConsumptionService) {
    this.machineryForm = this.fb.group({
      year: [{ value: '2023', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      building: [{ value: '', disabled: true }, Validators.required],
      vehicleCategory: ['', Validators.required],
      fuelType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      defaultEmissionFactor: this.fb.group({
        co2: [{ value: '', disabled: true }, Validators.required],
        ch4: [{ value: '', disabled: true }, Validators.required],
        n2o: [{ value: '', disabled: true }, Validators.required]
      }),
      partialEmissions: this.fb.group({
        co2: [{ value: '', disabled: true }],
        ch4: [{ value: '', disabled: true }],
        n2o: [{ value: '', disabled: true }]
      }),
      totalEmissions: [{ value: '', disabled: true }]
    });
    this.getFuelConsumptions()
  }

  getFuelConsumptions() {
    this.vehicleFuelService.getByYear(2023)
      .subscribe((fuel:any) => {
      this.vehicleTypes = fuel
      })
  }

  ngOnInit(): void {
    
  }

  setFuelTypes() {

    const machineryData = this.machineryForm.value
    console.log (machineryData.vehicleCategory.Categoria)
    this.vehicleFuelService.getByYearType(2023, machineryData.vehicleCategory.Categoria)
      .subscribe((fuelTypes:any) => {
        this.fuelTypes = fuelTypes
      })

}

setEmissionFactors () {
  console.log (this.machineryForm.value)
  const fuelData = this.machineryForm.value
  const fuelType = fuelData.fuelType
  const CO2_kg_ud = parseFloat(fuelType.CO2_kg_ud).toFixed(3);
  const CH4_g_ud = parseFloat(fuelType.CH4_g_ud).toFixed(3);
  const N2O_g_ud = parseFloat(fuelType.N2O_g_ud).toFixed(3);
  this.machineryForm.get('defaultEmissionFactor')?.get('co2')?.setValue(CO2_kg_ud);
  this.machineryForm.get('defaultEmissionFactor')?.get('ch4')?.setValue(CH4_g_ud);
  this.machineryForm.get('defaultEmissionFactor')?.get('n2o')?.setValue(N2O_g_ud);
  this.machineryForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity *  parseFloat(CO2_kg_ud));
  this.machineryForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * parseFloat(CH4_g_ud));
  this.machineryForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * parseFloat(N2O_g_ud));
  this.machineryForm.get('totalEmissions')?.setValue(fuelData.quantity * parseFloat(CO2_kg_ud)+fuelData.quantity * parseFloat(CH4_g_ud)+fuelData.quantity * parseFloat(N2O_g_ud))
}

onQuantityChange() {
  if (this.machineryForm.valid) {
    const fuelData = this.machineryForm.value
    const fuelType = fuelData.fuelType
    const CH4_g_ud = parseFloat( fuelType.CH4_g_ud );
    const CO2_kg_ud = parseFloat( fuelType.CO2_kg_ud );
    const N2O_g_ud = parseFloat( fuelType.N2O_g_ud );
    console.log (CO2_kg_ud, CH4_g_ud,  N2O_g_ud)
    console.log('Quantity:', fuelData.quantity* CH4_g_ud, fuelData.quantity*CO2_kg_ud, fuelData.quantity*N2O_g_ud);
    this.machineryForm.get('partialEmissions')?.get('co2')?.setValue(fuelData.quantity * CO2_kg_ud);
    this.machineryForm.get('partialEmissions')?.get('ch4')?.setValue(fuelData.quantity * CH4_g_ud);
    this.machineryForm.get('partialEmissions')?.get('n2o')?.setValue(fuelData.quantity * N2O_g_ud);
    this.machineryForm.get('totalEmissions')?.setValue(fuelData.quantity * CO2_kg_ud+fuelData.quantity * CH4_g_ud+fuelData.quantity * N2O_g_ud)
  }
}

/*   calculateEmissions(): void {
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
  } */

 /*  onFuelTypeChange() {
    const year = this.machineryForm.get('year')?.value;
    const fuelType = this.machineryForm.get('fuelType')?.value;
    this.vehicleFuelService.getByYearType(year, fuelType).subscribe(fuelValue => {
      console.log(`Selected Year: ${year}, Selected Fuel: ${fuelType}, Value: ${fuelValue}`);
      // Puedes actualizar el formulario o realizar otras acciones con el valor del combustible seleccionado
    });
  } */

  registerEmissions() { }
    
}