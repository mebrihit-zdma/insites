import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataService, ChartDataPoint } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stackedarea-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stackedarea-chart.component.html',
  styleUrl: './stackedarea-chart.component.css'
})
export class StackedareaChartComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  
  private chartDataSubscription: Subscription = new Subscription();
  private currentStateSubscription: Subscription = new Subscription();

  constructor(private chartDataService: ChartDataService) {}

                public chartOptions: ChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleColor: '#22252b',
                    bodyColor: '#333740',
                    borderColor: '#d0d1d4',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    titleFont: {
                      family: 'Inter',
                      size: 12,
                      weight: 600
                    },
                    bodyFont: {
                      family: 'Inter',
                      size: 11,
                      weight: 500
                    },
                    callbacks: {
                      title: function(context) {
                        return context[0].label;
                      },
                      label: function(context) {
                        const value = context.parsed.y;
                        const percentage = ((value / 40) * 100).toFixed(1);
                        return context.dataset.label + ': ' + value + ' (' + percentage + '%)';
                      },
                      afterLabel: function(context) {
                        const datasetIndex = context.datasetIndex;
                        const dataIndex = context.dataIndex;
                        const datasets = context.chart.data.datasets;
                        
                        if (dataIndex > 0) {
                          const currentValue = context.parsed.y;
                          const previousValue = datasets[datasetIndex].data[dataIndex - 1] as number;
                          const change = currentValue - previousValue;
                          const changePercent = ((change / previousValue) * 100).toFixed(1);
                          
                          if (change > 0) {
                            return '↑ +' + changePercent + '% vs previous';
                          } else if (change < 0) {
                            return '↓ ' + changePercent + '% vs previous';
                          } else {
                            return '→ No change vs previous';
                          }
                        }
                        return '';
                      }
                    }
                  }
                },
                    elements: {
                  line: {
                    tension: 0.2,
                    borderWidth: 3,
                    fill: false
                  },
                  point: {
                    radius: 4,
                    hoverRadius: 6,
                    borderWidth: 2,
                    backgroundColor: '#ffffff'
                  }
                },
                    scales: {
                  x: {
                    display: true,
                    grid: {
                      display: true,
                      color: 'rgba(161, 164, 170, 0.1)'
                    },
                    ticks: {
                      color: '#333740',
                      font: {
                        family: 'Inter',
                        size: 10,
                        weight: 500
                      },
                      maxRotation: 0,
                      padding: 8
                    },
                    border: {
                      display: false
                    }
                  },
                  y: {
                    display: true,
                    position: 'left' as const,
                    grid: {
                      display: true,
                      color: 'rgba(161, 164, 170, 0.15)',
                      lineWidth: 1
                    },
                    ticks: {
                      color: '#333740',
                      font: {
                        family: 'Inter',
                        size: 10,
                        weight: 500
                      },
                      padding: 8,
                      stepSize: 10,
                      callback: function(value) {
                        return value + '%';
                      }
                    },
                    border: {
                      display: false
                    },
                    min: 0,
                    max: 40,
                    beginAtZero: true
                  }
                },
                    animation: {
                  duration: 2500,
                  easing: 'easeInOutQuart',
                  onProgress: function(animation) {
                    const chart = animation.chart;
                    const ctx = chart.ctx;
                    const datasets = chart.data.datasets;
                    const time = Date.now();
                    
                    // Add enhanced proportional animation effects
                    datasets.forEach((dataset, datasetIndex) => {
                      const meta = chart.getDatasetMeta(datasetIndex);
                      if (meta.visible) {
                        meta.data.forEach((point, index) => {
                          const value = dataset.data[index] as number;
                          if (value !== null && value !== undefined) {
                            const maxValue = Math.max(...(dataset.data as number[]).filter(v => v !== null && v !== undefined));
                            const proportion = value / maxValue;
                            
                            // Enhanced pulsing effect based on proportion
                            const pulseIntensity = 0.2 + (proportion * 0.8);
                            const pulseAlpha = 0.4 + (Math.sin(time * 0.003 + index * 0.3) * 0.4 * pulseIntensity);
                            
                            // Dynamic glow effect
                            const glowIntensity = 8 + (proportion * 12);
                            const glowRotation = Math.sin(time * 0.001 + index) * 3;
                            
                            // Apply enhanced proportional glow effect
                            ctx.save();
                            ctx.shadowColor = (dataset.borderColor as string) || '#000000';
                            ctx.shadowBlur = glowIntensity;
                            ctx.shadowOffsetX = glowRotation;
                            ctx.shadowOffsetY = glowRotation;
                            ctx.globalAlpha = pulseAlpha;
                            
                            // Add trail effect for high proportions
                            if (proportion > 0.6) {
                              const trailLength = Math.floor(proportion * 8);
                              for (let i = 1; i <= trailLength; i++) {
                                const trailAlpha = (1 - i / trailLength) * 0.3 * proportion;
                                ctx.globalAlpha = trailAlpha;
                                ctx.shadowBlur = glowIntensity * (1 - i / trailLength);
                                ctx.beginPath();
                                ctx.arc(point.x, point.y, 3 + i, 0, Math.PI * 2);
                                ctx.fill();
                              }
                            }
                            
                            // Add data point enhancement for high proportions
                            if (proportion > 0.7) {
                              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                              ctx.globalAlpha = Math.sin(time * 0.008 + index) * 0.3 + 0.7;
                              ctx.beginPath();
                              ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                              ctx.fill();
                            }
                            
                            ctx.restore();
                            
                            // Add floating particles for very high proportions
                            if (proportion > 0.8) {
                              const particleCount = Math.floor(proportion * 3);
                              for (let i = 0; i < particleCount; i++) {
                                const particleAngle = (time * 0.002 + i * 0.8) % (Math.PI * 2);
                                const particleRadius = 8 + Math.sin(time * 0.005 + i) * 4;
                                const particleX = point.x + Math.cos(particleAngle) * particleRadius;
                                const particleY = point.y + Math.sin(particleAngle) * particleRadius;
                                
                                ctx.save();
                                ctx.fillStyle = (dataset.borderColor as string) || '#000000';
                                ctx.globalAlpha = Math.sin(time * 0.006 + i) * 0.4 + 0.6;
                                ctx.beginPath();
                                ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.restore();
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                },
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
                }
  };

                public chartLabels: string[] = ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
  public chartType: ChartType = 'line';

                public chartData: ChartDataset[] = [
                {
                  data: [8.5, 9.8, 10.2, 11.2, 12.4, 13.6, 14.8, 16.2, 18.6, 20.4, 22.3, 24.5, 26.7, 28.9, 31.2],
                  label: 'Speech',
                  backgroundColor: 'transparent',
                  borderColor: '#00A748',
                  pointBackgroundColor: '#ffffff',
                  pointBorderColor: '#00A748',
                  pointHoverBackgroundColor: '#ffffff',
                  pointHoverBorderColor: '#00A748',
                  fill: false,
                  tension: 0.2,
                  borderWidth: 3
                },
                {
                  data: [12.3, 13.7, 14.9, 15.7, 16.8, 18.1, 19.4, 21.3, 23.1, 25.2, 27.8, 30.1, 32.5, 35.2, 37.9],
                  label: 'Vision',
                  backgroundColor: 'transparent',
                  borderColor: '#E7FFC9',
                  pointBackgroundColor: '#ffffff',
                  pointBorderColor: '#E7FFC9',
                  pointHoverBackgroundColor: '#ffffff',
                  pointHoverBorderColor: '#E7FFC9',
                  fill: false,
                  tension: 0.2,
                  borderWidth: 3
                }
              ];

                ngOnInit() {
                // Initialize with default data immediately
                this.chartLabels = ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
                this.chartData[0].data = [8.5, 9.8, 10.2, 11.2, 12.4, 13.6, 14.8, 16.2, 18.6, 20.4, 22.3, 24.5, 26.7, 28.9, 31.2];
                this.chartData[1].data = [12.3, 13.7, 14.9, 15.7, 16.8, 18.1, 19.4, 21.3, 23.1, 25.2, 27.8, 30.1, 32.5, 35.2, 37.9];

                // Subscribe to chart data changes
                this.chartDataSubscription = this.chartDataService.getChartData().subscribe(data => {
                  if (data && data.length > 0) {
                    this.updateChartData(data);
                  }
                });

                // Subscribe to current state changes
                this.currentStateSubscription = this.chartDataService.getCurrentState().subscribe(state => {
                  const stateData = this.chartDataService.getChartDataForState(state);
                  if (stateData && stateData.length > 0) {
                    this.updateChartData(stateData);
                  }
                });

                // Initialize with service data if available
                const initialStateData = this.chartDataService.getChartDataForState('North Carolina');
                if (initialStateData && initialStateData.length > 0) {
                  this.updateChartData(initialStateData);
                }
              }

              ngAfterViewInit() {
                // Ensure chart is properly rendered after view initialization
                setTimeout(() => {
                  if (this.chart && this.chart.chart) {
                    this.chart.chart.update();
                  }
                }, 100);
              }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
    if (this.currentStateSubscription) {
      this.currentStateSubscription.unsubscribe();
    }
  }

                updateChartData(data: ChartDataPoint[]) {
                // Update chart labels and data based on new data
                this.chartLabels = data.map(item => item.date);

                // Update speech data
                this.chartData[0].data = data.map(item => item.speech);

                // Update vision data
                this.chartData[1].data = data.map(item => item.vision);

                // Force chart update
                if (this.chart && this.chart.chart) {
                  this.chart.chart.update();
                }
              }

              toggleDataset(index: number) {
                if (this.chart && this.chart.chart) {
                  const meta = this.chart.chart.getDatasetMeta(index);
                  meta.hidden = !meta.hidden;
                  this.chartData[index].hidden = meta.hidden;
                  this.chart.chart.update();
                }
              }
}
