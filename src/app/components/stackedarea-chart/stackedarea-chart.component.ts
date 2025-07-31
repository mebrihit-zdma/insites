import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-stackedarea-chart',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './stackedarea-chart.component.html',
  styleUrl: './stackedarea-chart.component.css'
})

export class StackedareaChartComponent {
      public areaChartOptions: ChartOptions = {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
              display: true,
              position: 'top',
              labels: {
              usePointStyle: true,
               //boxWidth: 0, 
              pointStyle: 'circle', // Optional: explicitly set point style to circle
            },
            },
        },
        //   elements: {
        //   line: {
        //     tension: 0.3,
        //   },
        // },
        scales: {
          x: {
            stacked: true, // Crucial for stacking on the x-axis
          },
          y: {
            stacked: true, // Crucial for stacking on the y-axis
          },
        },
      };

      public areaChartLabels: String[] = ['Jan 2022', 'Jun 2022', 'Jan 2023', 'Jun 2023', 'Jan 2024','Jun 2024','Jan 2025'];
      public areaChartType: ChartType = 'line'; // Use 'line' for area charts
      public areaChartLegend = true;

      getRandomDataPoints(count: number): number[] {
      return Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 1);
    }

      public areaChartData: ChartDataset[]
       = [
        {
          data:  [8, 9, 11,10,10.5,17, 22, 27, 30, 32],
          label: 'Speech 32.8%',
         // fill: 'origin', // Fills the area below the line
         // backgroundColor: 'rgba(77, 189, 116, 0.4)', // Example color
         backgroundColor:'#075300',
          borderColor: '#075300',
          //tension: 0.3,
        },
        {
          data:  [10, 11, 15, 25, 35, 45, 50, 47],
          label: 'Vision 32.8%',
          //fill: '-1', // Fills the area relative to the previous dataset
          backgroundColor: '#4ABB40',
          borderColor: '#4ABB40',
          // tension: 0.3,
        },
      ];
    }