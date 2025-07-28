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
        },
          elements: {
          line: {
            tension: 0.5,
          },
        },
        scales: {
          x: {
            stacked: true, // Crucial for stacking on the x-axis
          },
          y: {
            stacked: true, // Crucial for stacking on the y-axis
          },
        },
      };

      public areaChartLabels: String[] = ['January', 'February', 'March', 'April', 'May'];
      public areaChartType: ChartType = 'line'; // Use 'line' for area charts
      public areaChartLegend = true;

      public areaChartData: ChartDataset[] = [
        {
          data: [65, 59, 80, 81, 56],
          label: 'Series A',
         // fill: 'origin', // Fills the area below the line
          backgroundColor: 'rgba(77, 189, 116, 0.4)', // Example color
          borderColor: 'rgba(77, 189, 116, 1)',
          fill: false
        },
        {
          data: [28, 48, 40, 19, 86],
          label: 'Series B',
         // fill: '-1', // Fills the area relative to the previous dataset
          backgroundColor: 'grey',
          borderColor: 'rgba(255, 99, 132, 1)',
           fill: false
        },
      ];
    }