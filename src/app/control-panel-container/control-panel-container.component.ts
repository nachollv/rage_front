import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, ChartTypeRegistry, registerables  } from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScopeOneRecordsService } from '../services/scope-one-records.service';
import { ScopeTwoRecordsService } from '../services/scope-two-records.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MesesService } from '../services/meses.service';
import { FuelDataService } from '../services/fuel-data.service';
import { VehiclesFuelConsumptionService } from '../services/vehicles-fuel-consumption.service';

@Component({
  selector: 'app-control-panel-container',
  templateUrl: './control-panel-container.component.html',
  styleUrl: './control-panel-container.component.scss'
})

export class ControlPanelContainerComponent implements OnInit {
  filterForm!: FormGroup; // Formulario reactivo
  availableYears: number[] = [2021, 2022, 2023, 2024]; // Años disponibles
  viewUserMenu: boolean = true
  role: string = '' // Rol del usuario
  userName: string = '' // Nombre del usuario
  userId: number = 0 // ID del usuario
  organizacionID: number = 0 // ID de la organización
  token: string = '' // Token del usuario
  prodCenterID: number = 0 // ID del centro de producción
  scopeOneRecords: any[] = [] // Lista de registros de Scope 1
  scopeTwoRecords: any[] = [] // Lista de registros de Scope 2
  displayedColumnsScope1FI: string[] = ['activity Year', 'Invoice period', 'fuelType', 'activity Data', 'updated At']
  displayedColumnsScope1RT: string[] = ['activity Year', 'Invoice period', 'Categoría vehículo', 'fuel Type', 'activityData',  'updated_at']
  displayedColumnsScope1TransFerMarAe: string[] = ['activity Year', 'Invoice period', 'equipmentType', 'fuelType', 'activityData', 'updated_at']


  displayedColumnsScope2: string[] = ['year', 'periodoFactura', 'activityData', 'activityType', 'electricityTradingCompany', 'gdo', 'energyType', 'updated_at']
  fuelTypes: { id: number; Combustible: string }[] = []; // Define fuelTypes property
  vehicleCategories: { id: number; Combustible: string; Categoria: string }[] = []

  chartInstanceFixedEmis: Chart | null = null;
  chartInstanceElectricityBuildings: Chart | null = null;
  chartInstanceElectricityVehicles: Chart | null = null;
  chartInstanceHeatSteamColdCompAir: Chart | null = null;
  chartInstanceRoadTransp: Chart | null = null;
  chartInstanceRailSeaAir: Chart | null = null;
  chartInstanceMachinery: Chart | null = null;
  chartInstanceFugitiveEmiss: Chart | null = null;

  data = [{ }]
  dataSourceScope1FixedEmis = new MatTableDataSource<any>(this.data)
  dataSourceScope1RoadTransp = new MatTableDataSource<any>(this.data)
  dataSourceScope1RailSeaAir = new MatTableDataSource<any>(this.data)
  dataSourceScope1Machinery = new MatTableDataSource<any>(this.data)
  dataSourceScope1FugitiveEmiss = new MatTableDataSource<any>(this.data)

  dataSourceScope2ElectricityBuildings = new MatTableDataSource<any>(this.data)
  dataSourceScope2ElectricityVehicles = new MatTableDataSource<any>(this.data)
  dataSourceScope2SteamColdCompAir = new MatTableDataSource<any>(this.data)

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
    private mesesService: MesesService,
    private fuelDataService: FuelDataService,
    private vehicleFuelService: VehiclesFuelConsumptionService,
    private scopeOneRecordsService: ScopeOneRecordsService,
    private scopeTwoRecordsService: ScopeTwoRecordsService) {}

  ngOnInit():void {
    this.filterForm = this.fb.group({
      activityYear: [new Date().getFullYear()-2], // Por defecto, el año actual menos 2
    });

    this.token = this.authService.getToken() || ''
    if (this.token === '') {
      this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
      this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
    } 
    Chart.register(...registerables);
    this.getFixedFuelConsumptions(this.filterForm.value.activityYear)
    this.getFuelConsumptions(this.filterForm.value.activityYear)
    this.getScopeOneRecords(this.filterForm.value.activityYear)
    this.getScopeTwoRecords(this.filterForm.value.activityYear)
  }

  onYearFilterChange(event: any): void {
    const activityYear = event;
    this.getScopeOneRecords(activityYear)
    this.getScopeTwoRecords(activityYear)
  }

  getScopeOneRecords(activityYear: number): void {
      this.scopeOneRecordsService.getRecordsByFilters(activityYear).subscribe(
          (response: any) => {
            this.scopeOneRecords = response.data;
            const meses = this.mesesService.getMeses();
            this.scopeOneRecords.forEach((registro: any) => {
              const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
              registro['Invoice period'] = resultado?.value || 'desconocido';
              registro['activity Data'] = registro.activityData
              registro['activity Year'] = registro.year
              registro['updated At'] = registro.updated_at
              registro.edit = false
              registro.delete = true

            });
            if (this.scopeOneRecords.length > 0) {
             
              this.fixedInstChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'fixed'));
              this.roadTranspChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'roadTransp'));
              this.railSeaAirChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'transferma'));
              /*   this.machineryChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'machinery'));
              this.fugitiveEmissChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'fugitiveEmissions')); */
            } else {
              this.showSnackBar('No hay registros con activityType "fixed".');
              //this.dataSourceScope1 = new MatTableDataSource<any>([]);
            }
          },
          (error) => {
              if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
                  this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
              } else {
                  this.showSnackBar('Error al obtener registros de Alcance 1.');
              }
          }
      );
  }
  
  getScopeTwoRecords(activityYear:number): void {
    this.scopeTwoRecordsService.getRecordsByFilters(activityYear).subscribe(
      (response: any) => {
        this.scopeTwoRecords = response.data;
        const meses = this.mesesService.getMeses();
        this.scopeTwoRecords.forEach((registro: any) => {
          const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
          registro.periodoFactura = resultado?.value || 'desconocido';
        });
        if (this.scopeTwoRecords.length > 0) {
          //this.dataSourceScope2 = new MatTableDataSource(this.scopeTwoRecords);
          this.electricityBuildings('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityBuildings'));
          this.electricityVehicles('line', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityVehicles'));
          this.heatSteamColdCompAir('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'heatSteamColdAir'));
        } else {
          this.showSnackBar('No hay registros con activityType "electricityBuildings".');
          //this.dataSourceScope2 = new MatTableDataSource<any>([]);
        }
      },
      (error) => {
          if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
              this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
          } else {
              this.showSnackBar('Error al obtener registros de Alcance 2.');
          }
      }
    );
  }

  fixedInstChart(chartType: keyof ChartTypeRegistry, scop1DataFI: any): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0

    scop1DataFI.forEach((dataObjectFI: any) => {
      const monthIndex = parseInt(dataObjectFI.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObjectFI.activityData); // Asignar cantidad al mes correspondiente
      const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === dataObjectFI.fuelType);
      dataObjectFI['fuelType'] = matchedFuel?.Combustible || 'desconocido '+dataObjectFI['fuelType'];
    });
    this.dataSourceScope1FixedEmis = new MatTableDataSource(scop1DataFI);

    if (this.chartInstanceFixedEmis) {
        this.chartInstanceFixedEmis.destroy();
    }
    this.chartInstanceFixedEmis = new Chart(ctx, {
        type: chartType,
        data: {
            labels: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ],
            datasets: [{
                label: 'Emissions',
                data: monthlyData,
                backgroundColor: '#B22222',
                borderColor: '#B22222',
                borderWidth: 1,
                order: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Fixed Installations - Emissions and objective'
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    stacked: true
                }
            }
        }
    });
  }
  roadTranspChart(chartType: keyof ChartTypeRegistry, scop1DataRD: any): void {
    const ctx = document.getElementById('roadTranspChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1DataRD.forEach((dataObject: any) => {

      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Asignar cantidad al mes correspondiente
      const equipmentType = this.vehicleCategories.find((vehicleItem: any) => vehicleItem.id === dataObject.equipmentType)
      dataObject['Categoría vehículo'] = equipmentType?.Categoria
      const fuelType = this.fuelTypes.find((fuelItem:any) => fuelItem.id === dataObject.fuelType)
      dataObject['fuel Type'] = fuelType?.Combustible

    });
    this.dataSourceScope1RoadTransp = new MatTableDataSource(scop1DataRD);

    if (this.chartInstanceRoadTransp) {
        this.chartInstanceRoadTransp.destroy();
    }
    this.chartInstanceRoadTransp = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          // this dataset is drawn below
          order: 1
      }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#696969' // Gris oscuro para etiquetas
        }
      },
      title: {
        display: true,
        text: 'Transporte por carretera - Emissions and objective'
      }
    },
    scales: {
      x: { ticks: { color: '#696969' } },
      y: { ticks: { color: '#696969' } }
    }
    }
    });
  }
  railSeaAirChart(chartType: keyof ChartTypeRegistry, scop1DataRSA: any): void {
    console.log ("rail", scop1DataRSA)
    const ctx = document.getElementById('railSeaAirChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1DataRSA.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Asignar cantidad al mes correspondiente
      const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === dataObject.fuelType)
/*       console.log("matched fuel", matchedFuel)
      console.log("dataObject", dataObject) */
    });
    this.dataSourceScope1RailSeaAir = new MatTableDataSource(scop1DataRSA);
    if (this.chartInstanceRailSeaAir) {
        this.chartInstanceRailSeaAir.destroy();
    }
    this.chartInstanceRailSeaAir = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          order: 1
      }]
  },
  options: {
    /*  responsive: true,
       maintainAspectRatio: true,  */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Transporte ferroviario, marítimo, aéreo - Emissions and objective'
        }
      },
      interaction: {  
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    }
    });
  }
  machineryChart(chartType: keyof ChartTypeRegistry, scop1DataMA: any): void {
    const ctx = document.getElementById('machineryChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1DataMA.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });
    this.dataSourceScope1Machinery = new MatTableDataSource(scop1DataMA);
    if (this.chartInstanceMachinery) {
        this.chartInstanceMachinery.destroy();
    }
    this.chartInstanceMachinery = new Chart(ctx, {
      type: chartType,
      data: {
      labels: [          'January',
      'February',
      'March',
      'April',          'May',
      'June',
      'July',
      'August',          'September',
      'October',
      'November',
      'December',],
    datasets: [{
      label: 'Emissions',
      data: monthlyData,
      backgroundColor: '#B22222', // Verde bosque
      borderColor: '#B22222',
      borderWidth: 1,  // this dataset is drawn below
      // this dataset is drawn below
      order: 1
  }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#696969' // Gris oscuro para etiquetas
        }
      },
      title: {
        display: true,
        text: 'Maquinaria - Emissions and objective'
      }
    },
    scales: {
      x: { ticks: { color: '#696969' } },
      y: { ticks: { color: '#696969' } }
    }
  }
    });
  }
  fugitiveEmissChart(chartType: keyof ChartTypeRegistry, scop1DataFE: any): void {
    const ctx = document.getElementById('fugitiveEmissChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1DataFE.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });
    this.dataSourceScope1FugitiveEmiss = new MatTableDataSource(scop1DataFE);
    if (this.chartInstanceFugitiveEmiss) {
        this.chartInstanceFugitiveEmiss.destroy();
    }
    this.chartInstanceFugitiveEmiss = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          order: 1
        }]
  },
  options: {
    /*  responsive: true,
       maintainAspectRatio: true,  */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Emisiones fugitivas - Emissions and objective'
        }
      },
      interaction: {  
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    }
    });
  }

  electricityBuildings(chartType: keyof ChartTypeRegistry, scop2Data: any): void {
    const ctx = document.getElementById('electricityBuildings') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop2Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Asignar cantidad al mes correspondiente
    });
    this.dataSourceScope2ElectricityBuildings = new MatTableDataSource(scop2Data);
    if (this.chartInstanceElectricityBuildings) {
        this.chartInstanceElectricityBuildings.destroy();
    }
    this.chartInstanceElectricityBuildings = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#555555', 
          borderColor: '#555555',
          borderWidth: 1,
          order: 1
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Consumo eléctrico en edificios - Emissions and objective'
        }
      },
      interaction: {  
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    }
    });
  }
  electricityVehicles(chartType: keyof ChartTypeRegistry, scop2Data: any): void {
    const ctx = document.getElementById('electricityVehicles') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop2Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Asignar cantidad al mes correspondiente
    });
    /* console.log(scop2Data, monthlyData) */
    if (this.chartInstanceElectricityVehicles) {
        this.chartInstanceElectricityVehicles.destroy();
    }
    this.chartInstanceElectricityVehicles = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#555555', // Gris oscuro
          borderColor: '#555555',
          borderWidth: 1,
          // this dataset is drawn below
          order: 1
      }]
  },
  options: {
/*       responsive: true,
      maintainAspectRatio: true, */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Consumo eléctrico en vehículos - Emissions and objective'
        }
      },
      interaction: {  
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    }
    });
  }
  heatSteamColdCompAir(chartType: keyof ChartTypeRegistry, scop2Data: any): void {
    const ctx = document.getElementById('heatSteamColdCompAir') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop2Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Asignar cantidad al mes correspondiente
    });
    /* console.log(scop2Data, monthlyData) */
    if (this.chartInstanceHeatSteamColdCompAir) {
        this.chartInstanceHeatSteamColdCompAir.destroy();
    }
    this.chartInstanceHeatSteamColdCompAir = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',          'May',
          'June',
          'July',
          'August',          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [{
          label: 'Emissions',
          data: monthlyData,
          backgroundColor: '#555555',
          borderColor: '#555555',
          borderWidth: 1,
          order: 1
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Calor, vapor, frío y aire comprimido - Emissions and objective'
        }
      },
      interaction: {  
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    }
    });
  }

  getFixedFuelConsumptions(year: number) {
    this.fuelDataService.getByYear(year)
    .subscribe((fuel:any) => {
      this.fuelTypes = fuel
    })
  }

  getFuelConsumptions(year: number) {
    this.vehicleFuelService.getByYear(year)
      .subscribe((category:any) => {
      this.vehicleCategories = category
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

