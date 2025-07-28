import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartEvent, ChartType,ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,

})
export class DoughnutChartComponent {

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
            }
      //     annotation: {
      //   annotations: [
      //     {
      //       type: 'line',
      //       scaleID: 'x',
      //       value: 'March',
      //       borderColor: 'orange',
      //       borderWidth: 2,
      //       label: {
      //         display: true,
      //         position: 'center',
      //         color: 'orange',
      //         content: 'LineAnno',
      //         font: {
      //           weight: 'bold',
      //         },
      //       },
      //     },
      //   ],
      // },
          }
    };
  public doughnutChartLabels: string[] = [
    'National',
    'Florida'
  ];



  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [29.4,(100-29.4)] ,    backgroundColor: [
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