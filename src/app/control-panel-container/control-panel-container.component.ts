import { Component, OnInit } from '@angular/core';
import { Chart, registerables  } from 'chart.js';

@Component({
  selector: 'app-control-panel-container',
  templateUrl: './control-panel-container.component.html',
  styleUrl: './control-panel-container.component.scss'
})


export class ControlPanelContainerComponent implements OnInit {
 
  constructor() {
  
  }

  ngOnInit() { 
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
          // this dataset is drawn below
          order: 2
      }, {
          label: 'Objectives',
          data: [10, 15, 19, 17],
          type: 'line',
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

