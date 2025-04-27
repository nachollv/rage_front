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
  activityYear: number = new Date().getFullYear()-2; // Año de actividad asignado por defecto
  token: string = '' // Token del usuario
  prodCenterID: number = 0 // ID del centro de producción
  scopeOneRecords: any[] = [] // Lista de registros de Scope 1
  scopeTwoRecords: any[] = [] // Lista de registros de Scope 2
  displayedColumnsScope1: string[] = ['year', 'equipmentType', 'fuelType', 'quantity', 'activityType', 'updated_at']
  displayedColumnsScope2: string[] = ['year', 'periodoFactura', 'activityData', 'activityType', 'electricityTradingCompany', 'gdo', 'energyType', 'updated_at']

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
      activityYear: [new Date().getFullYear()], // Por defecto, el año actual
    });

    this.token = this.authService.getToken() || ''
    if (this.token === '') {
      this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
      this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
    } 
    Chart.register(...registerables);
    this.getScopeOneRecords(this.filterForm.value.activityYear)
    this.getScopeTwoRecords(this.filterForm.value.activityYear)
/*     this.fixedInstChart('line'); */
    /* this.roadTranspChart('bar');
    this.railSeaAirChart('line');
    this.machineryChart('bar');
    this.fugitiveEmissChart('line'); */

   /*  this.electricityBuildings('line'); */
    this.electricityVehicles('bar');
    this.heatSteamColdCompAir('line');
  }

  onYearFilterSubmit(): void {
    // Obtener el valor seleccionado del formulario
    const activityYear = this.filterForm.value.activityYear;

    // Lógica para filtrar los datos por año
    console.log('Filtrar por año:', activityYear);
    this.getScopeOneRecords(activityYear)
    this.getScopeTwoRecords(activityYear)
  }

  getScopeOneRecords(activityYear: number): void {
      this.scopeOneRecordsService.getRecordsByFilters(activityYear).subscribe(
          (response: any) => {
            this.scopeOneRecords = response.data;
              console.log('Scope 1 Records:', this.scopeOneRecords);
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
        console.log('Scope 2 Records:', this.scopeTwoRecords);
        this.dataSourceScope2 = new MatTableDataSource(this.scopeTwoRecords)
        this.electricityBuildings('line', this.scopeTwoRecords);
      },
      (error) => {
          if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
             /*  console.error('No se encontraron registros:', error); */
              this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
          } else {
           /*    console.error('Error fetching Scope 1 records:', error); */
              this.showSnackBar('Error al obtener registros de Alcance 2.');
          }
      }
    );
  }

  fixedInstChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
    console.log('Scope 1 fixed Data:', scop1Data);
    new Chart(ctx, {

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
          data: scop1Data,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          order: 1
        }/* , {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000',
          borderColor: '#008000',
          borderWidth: 1, */
          // this dataset is drawn on top
          /* order: 1 */
      /* }*/] 
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
    console.log('Scope 1 road Transport Data:', scop1Data);
    const ctx = document.getElementById('roadTranspChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
          data: scop1Data,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', // Púrpura vivo
          borderColor: '#008000',
          borderWidth: 2,
          // this dataset is drawn on top
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
    console.log('Scope 1 railSeaAir Data:', scop1Data);
    const ctx = document.getElementById('railSeaAirChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
          data: scop1Data,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', // Púrpura vivo
          borderColor: '#008000',
          borderWidth: 1,
          // this dataset is drawn on top
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
    console.log('Scope 1 machinery Data:', scop1Data);
    const ctx = document.getElementById('machineryChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
      data: scop1Data,
      backgroundColor: '#B22222', // Verde bosque
      borderColor: '#B22222',
      borderWidth: 1,  // this dataset is drawn below
      // this dataset is drawn below
      order: 2
  }, {
      label: 'Objective',
      data: [10, 15, 19, 17],
      type: 'line',
      backgroundColor: '#008000', // Púrpura vivo
      borderColor: '#008000',
      borderWidth: 2,
      // this dataset is drawn on top
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
    console.log('Scope 1 fugitive emissions Data:', scop1Data);
    const ctx = document.getElementById('fugitiveEmissChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
          data: scop1Data,
          backgroundColor: '#B22222', // Verde bosque
          borderColor: '#B22222',
          borderWidth: 1,  // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', // Púrpura vivo
          borderColor: '#008000',
          borderWidth: 1,
          // this dataset is drawn on top
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
    new Chart(ctx, {
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
          data: scop2Data,
          backgroundColor: '#555555', 
          borderColor: '#555555',
          borderWidth: 1,
          // this dataset is drawn below
          order: 1
      }/* , { */
          /* label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', 
          borderColor: '#008000',
          borderWidth: 1, */
          // this dataset is drawn on top
          /* order: 1 */
      /* } */]
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
  electricityVehicles(chartType: keyof ChartTypeRegistry): void {
    const ctx = document.getElementById('electricityVehicles') as HTMLCanvasElement;
    new Chart(ctx, {
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
          data: [10, 20, 30, 40],
          backgroundColor: '#555555', // Gris oscuro
          borderColor: '#555555',
          borderWidth: 1,
          // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', // Púrpura vivo
          borderColor: '#008000',
          borderWidth: 2,
          // this dataset is drawn on top
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
  heatSteamColdCompAir(chartType: keyof ChartTypeRegistry): void {
    const ctx = document.getElementById('heatSteamColdCompAir') as HTMLCanvasElement;
    new Chart(ctx, {
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
          data: [10, 20, 30, 40,10, 20, 30, 40,10, 20, 30, 40],
          backgroundColor: '#555555', // Gris oscuro
          borderColor: '#555555',
          borderWidth: 1,
          // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#008000', // Púrpura vivo
          borderColor: '#008000',
          borderWidth: 2,
          // this dataset is drawn on top
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

