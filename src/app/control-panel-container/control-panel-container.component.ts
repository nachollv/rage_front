import { Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables  } from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-control-panel-container',
  templateUrl: './control-panel-container.component.html',
  styleUrl: './control-panel-container.component.scss'
})


export class ControlPanelContainerComponent implements OnInit {
  viewUserMenu: boolean = true
  role: string = '' // Rol del usuario
  constructor(private jwtHelper: JwtHelperService, ) {
  
  }

  ngOnInit():void {
    Chart.register(...registerables);
    this.fixedInstChart('line');
    this.roadTranspChart('bar');
    this.railSeaAirChart('line');
    this.machineryChart('bar');
    this.fugitiveEmissChart('line');

    this.electricityBuildings('line');
    this.electricityVehicles('bar');
    this.heatSteamColdCompAir('line');
  }

  fixedInstChart(chartType: keyof ChartTypeRegistry): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
    new Chart(ctx, {

      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April'
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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
          'April'
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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
          'April'
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
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
      backgroundColor: '#2E8B57', // Púrpura vivo
      borderColor: '#2E8B57',
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
          'April'
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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


  electricityBuildings(chartType: keyof ChartTypeRegistry): void {
    const ctx = document.getElementById('electricityBuildings') as HTMLCanvasElement;
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April'
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
          backgroundColor: '#2E8B57', // Naranja quemado
          borderColor: '#2E8B57',
          borderWidth: 1,
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
          'April'
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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
          'April',          'January',
          'February',
          'March',
          'April',          'January',
          'February',
          'March',
          'April',
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
          backgroundColor: '#2E8B57', // Púrpura vivo
          borderColor: '#2E8B57',
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

