import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartEvent, ChartType,ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
  import * as pluginAnnotation from 'chartjs-plugin-annotation';
 import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,

})
export class DoughnutChartComponent {
      constructor() {
        Chart.register(...registerables); // Register the core Chart.js components
        Chart.register(pluginAnnotation); // Register the annotation plugin
    }


        public doughnutChartOptions: ChartConfiguration['options'] = {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
              usePointStyle: true,
              pointStyle: 'circle', // Optional: explicitly set point style to circle
            },
            },

          annotation: {
                  annotations: {
        label1: {
          type: 'label',
          xValue: 50,
          yValue: 60,
          position:'center',
          backgroundColor: 'rgba(245,245,245)',
          content: ['This is my text'],
          font: {
            size: 18
          }
        }
      }
      },
          }
    };
  public doughnutChartLabels: string[] = [
    'National',
    'Florida'
  ];

  ngOnInit() {

  }



  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [29.4,(100-29.4)],    backgroundColor: [
      '#075300',
      '#E7F6E5'
    ]},
      { data: [32.8,(100-32.8)],backgroundColor: [
      '#4ABB40',
      '#E7F6E5'
    ] }
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';


  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }
}