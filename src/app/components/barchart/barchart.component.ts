    // my-chart.component.ts
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
 import { BaseChartDirective } from 'ng2-charts';

    @Component({
      selector: 'app-bar-chart',
      standalone: true,
      imports: [CommonModule,BaseChartDirective], // Add NgChartsModule here
      templateUrl: './barchart.component.html',
      styleUrls: ['./barchart.component.css']
    })
    export class BarChartComponent {
      public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
          x: {  border: {
          display: false // Hide x-axis border line
        }},
          y: {
            min: 1,
              border: {
          display: false // Hide x-axis border line
        }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
            usePointStyle: true,
            pointStyle: 'circle', // Optional: explicitly set point style to circle
          },
          }
        }
      };
      public barChartType: ChartType = 'bar';
      public barChartData: ChartData<'bar'> = {
        labels: ["NC", "TX", "FL", "VA", "IL"],
        datasets: [
          { data:   /*dementia */ [14, 13, 12, 10, 10], label: 'Dementia', backgroundColor: '#075300',borderRadius:5},
          { data:   /*parkinsons */ [13, 6, 8, 16, 16], label:  "Parkinson's", backgroundColor: '#4ABB40',borderRadius:5},
          { data:     /*ischemic stroke */ [7, 9, 17, 18, 10], label:  "Ischemic Stroke", backgroundColor: '#E7F6E5',borderRadius:5},
          { data:   /*Alzheimer's */ [9, 13, 11, 5, 10], label:  "Alzheimer's", backgroundColor: '#333740',borderRadius:5},
          { data:   /*Cognitive */ [17, 6, 8, 16, 16], label:  "Cognitive", backgroundColor: '#D0D1D4',borderRadius:5},
        ]
      };
    }