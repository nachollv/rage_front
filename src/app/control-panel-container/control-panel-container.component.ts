import { Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables  } from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScopeOneRecordsService } from '../services/scope-one-records.service';
import { ScopeTwoRecordsService } from '../services/scope-two-records.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-control-panel-container',
  templateUrl: './control-panel-container.component.html',
  styleUrl: './control-panel-container.component.scss'
})


export class ControlPanelContainerComponent implements OnInit {
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
  displayedColumns: string[] = ['year', 'fuelType', 'activityData', 'updated_at', 'edit', 'delete']
  data = [{ }]
  dataSourceScope1 = new MatTableDataSource<any>(this.data)
  dataSourceScope2 = new MatTableDataSource<any>(this.data)

  constructor(
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private scopeOneRecordsService: ScopeOneRecordsService,
    private scopeTwoRecordsService: ScopeTwoRecordsService) {}

  ngOnInit():void {
    this.token = this.authService.getToken() || ''
    if (this.token === '') {
      this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
      this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
    } 
    Chart.register(...registerables);
    this.getScopeOneRecords()
    this.getScopeTwoRecords()
/*     this.fixedInstChart('line'); */
    this.roadTranspChart('bar');
    this.railSeaAirChart('line');
    this.machineryChart('bar');
    this.fugitiveEmissChart('line');

   /*  this.electricityBuildings('line'); */
    this.electricityVehicles('bar');
    this.heatSteamColdCompAir('line');
  }

  getScopeOneRecords(): void {
    this.scopeOneRecordsService.getRecordsByFilters(this.activityYear).subscribe(
      (response: any) => {
        this.scopeOneRecords = response.data;
        console.log('Scope 1 Records:', this.scopeOneRecords);
        this.dataSourceScope1 = new MatTableDataSource(this.scopeOneRecords) 
        this.fixedInstChart('line', this.scopeOneRecords);
      },
      (error) => {
        console.error('Error fetching Scope 1 records:', error);
      }
    );
  }
  getScopeTwoRecords(): void {
    this.scopeTwoRecordsService.getRecordsByFilters(this.activityYear).subscribe(
      (response: any) => {
        this.scopeTwoRecords = response.data;
        console.log('Scope 2 Records:', this.scopeTwoRecords);
        this.dataSourceScope2 = new MatTableDataSource(this.scopeTwoRecords)
        this.electricityBuildings('line', this.scopeTwoRecords);
      },
      (error) => {
        console.error('Error fetching Scope 2 records:', error);
      }
    );
  }

  fixedInstChart(chartType: keyof ChartTypeRegistry, scop1Data: any): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
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
  roadTranspChart(chartType: keyof ChartTypeRegistry): void {
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
          data: [10, 20, 30, 40],
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
  railSeaAirChart(chartType: keyof ChartTypeRegistry): void {
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
          data: [10, 20, 30, 40],
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
  machineryChart(chartType: keyof ChartTypeRegistry): void {
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
      data: [10, 20, 30, 40],
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
  fugitiveEmissChart(chartType: keyof ChartTypeRegistry): void {
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
          data: [10, 20, 30, 40],
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
}

