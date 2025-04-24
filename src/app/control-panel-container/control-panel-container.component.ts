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
          borderColor: '#333333',
          borderWidth: 1,  // this dataset is drawn below
          order: 2
        }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#FF6347', // Naranja quemado
          borderColor: '#FF6347',
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
            text: 'Fixed Installations - Emisions and objective'
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
          borderColor: '#333333',
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
        text: 'Transporte por carretera - Emisions and objective'
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
          borderColor: '#333333',
          borderWidth: 1,  // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#FF6347', // Naranja quemado
          borderColor: '#FF6347',
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
          text: 'Transporte ferroviario, marítimo, aéreo - Emisions and objective'
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
      borderColor: '#333333',
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
        text: 'Maquinaria - Emisions and objective'
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
          borderColor: '#333333',
          borderWidth: 1,  // this dataset is drawn below
          order: 2
      }, {
          label: 'Objective',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: '#FF6347', // Naranja quemado
          borderColor: '#FF6347',
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
          text: 'Emisiones fugitivas - Emisions and objective'
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
    /*  responsive: true,
       maintainAspectRatio: true,  */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Consumo eléctrico en edificios - Emisions and objective'
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
          backgroundColor: [
            'rgba(255, 0, 0, 0.8)', // Rojo vivo
            'rgba(54, 162, 235, 0.8)', // Azul vivo
            'rgba(255, 206, 86, 0.8)', // Amarillo vivo
            'rgba(0, 255, 0, 0.8)'  // Verde vivo
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
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
    /*  responsive: true,
       maintainAspectRatio: true,  */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Consumo eléctrico en vehículos - Emisions and objective'
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
    /*  responsive: true,
       maintainAspectRatio: true,  */
      plugins: {  
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Calor, vapor, frío y aire comprimido - Emisions and objective'
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

