import { Component, OnInit } from '@angular/core';
import { Chart, registerables  } from 'chart.js';
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
    this.createBarChart();
  }

  createBarChart(): void {
    const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April'
        ],
        datasets: [{
          label: 'Consumption',
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
          label: 'Objectives',
          data: [10, 15, 19, 17],
          type: 'line',
          backgroundColor: 'rgba(153, 102, 255, 0.8)', // Púrpura vivo
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          // this dataset is drawn on top
          order: 1
      }]
  },
      options: {
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

