import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, ChartTypeRegistry, registerables  } from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScopeOneRecordsService } from '../services/scope-one-records.service';
import { ScopeTwoRecordsService } from '../services/scope-two-records.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  displayedColumnsScope1: string[] = ['year', 'periodoFactura', 'equipmentType', 'fuelType', 'quantity', 'activityType', 'updated_at']
  displayedColumnsScope2: string[] = ['year', 'periodoFactura', 'activityData', 'activityType', 'electricityTradingCompany', 'gdo', 'energyType', 'updated_at']

  chartInstanceFixedEmis: Chart | null = null;
  chartInstanceElectricityBuildings: Chart | null = null;
  chartInstanceElectricityVehicles: Chart | null = null;
  chartInstanceHeatSteamColdCompAir: Chart | null = null;
  chartInstanceRoadTransp: Chart | null = null;
  chartInstanceRailSeaAir: Chart | null = null;
  chartInstanceMachinery: Chart | null = null;
  chartInstanceFugitiveEmiss: Chart | null = null;

  data = [{ }]
  dataSourceScope1 = new MatTableDataSource<any>(this.data)
  dataSourceScope2 = new MatTableDataSource<any>(this.data)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
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
              if (this.scopeOneRecords.length > 0) {
                this.dataSourceScope1 = new MatTableDataSource(this.scopeOneRecords);
                this.fixedInstChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'fixed'));
                this.roadTranspChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'roadTransp'));
                this.railSeaAirChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'transferma'));
                this.machineryChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'machinery'));
                this.fugitiveEmissChart('line', this.scopeOneRecords.filter((record: any) => record.activityType === 'fugitiveEmissions'));
              } else {
                this.showSnackBar('No hay registros con activityType "fixed".');
                this.dataSourceScope1 = new MatTableDataSource<any>([]);
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
        if (this.scopeTwoRecords.length > 0) {
          this.dataSourceScope2 = new MatTableDataSource(this.scopeTwoRecords);
          this.electricityBuildings('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityBuildings'));
          this.electricityVehicles('line', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityVehicles'));
          this.heatSteamColdCompAir('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'heatSteamColdAir'));
        } else {
          this.showSnackBar('No hay registros con activityType "electricityBuildings".');
          this.dataSourceScope2 = new MatTableDataSource<any>([]);
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

  fixedInstChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0

    scop1Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });

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
  roadTranspChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('roadTranspChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });

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
  railSeaAirChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('railSeaAirChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });

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
  machineryChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('machineryChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });

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
  fugitiveEmissChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('fugitiveEmissChart') as HTMLCanvasElement;
    const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
    scop1Data.forEach((dataObject: any) => {
      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
      monthlyData[monthIndex] += parseFloat(dataObject.quantity); // Asignar cantidad al mes correspondiente
    });

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
    console.log(scop2Data, monthlyData)
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
    console.log(scop2Data, monthlyData)
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

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 15000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}

