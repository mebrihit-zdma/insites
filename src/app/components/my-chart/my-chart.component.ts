    // my-chart.component.ts
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
 import { BaseChartDirective } from 'ng2-charts';

    @Component({
      selector: 'app-my-chart',
      standalone: true,
      imports: [CommonModule,BaseChartDirective], // Add NgChartsModule here
      templateUrl: './my-chart.component.html',
      styleUrls: ['./my-chart.component.css']
    })
    export class MyChartComponent {
      public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
          x: {},
          y: {
            min: 10
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        }
      };
      public barChartType: ChartType = 'bar';
      public barChartData: ChartData<'bar'> = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [
          { data: [65, 59, 80, 81, 56], label: 'Series A' },
          { data: [28, 48, 40, 19, 86], label: 'Series B' }
        ]
      };
    }