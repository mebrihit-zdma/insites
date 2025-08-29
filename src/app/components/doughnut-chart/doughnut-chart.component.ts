import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartEvent, ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotation from 'chartjs-plugin-annotation';
import { Chart, registerables } from 'chart.js';
import { StrokeMortalityService, StrokeMortalityData } from '../../services/stroke-mortality.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doughnut-chart',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,

})
export class DoughnutChartComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private strokeMortalitySubscription: Subscription = new Subscription();
  
  constructor(
    private strokeMortalityService: StrokeMortalityService,
    private cdr: ChangeDetectorRef
  ) {
    Chart.register(...registerables); // Register the core Chart.js components
    Chart.register(pluginAnnotation); // Register the annotation plugin
  }


  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: 'Inter',
            size: 12,
            weight: 'normal'
          },
          color: '#333740',
          generateLabels: function(chart) {
            const datasets = chart.data.datasets;
            const labels = chart.data.labels as string[];
            
            return labels.map((label, index) => {
              const dataset = datasets[index];
              const value = dataset.data[0] as number;
              return {
                text: `${label} ${value}%`,
                fillStyle: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] as string : dataset.backgroundColor as string,
                strokeStyle: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] as string : dataset.backgroundColor as string,
                lineWidth: 0,
                pointStyle: 'circle',
                hidden: false,
                index: index
              };
            });
          }
        }
      },
      annotation: {
        annotations: {
          label1: {
            type: 'label',
            xValue: 50,
            yValue: 50,
            position: 'center' as const,
            backgroundColor: 'transparent',
            content: ['Per 100k'],
            font: {
              size: 14,
              weight: 'normal',
              family: 'Inter'
            },
            color: '#101828'
          }
        }
      }
    },
    animation: {
      duration: 3000,
      easing: 'easeInOutQuart',
      onProgress: function(animation) {
        const chart = animation.chart;
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;
        const time = Date.now();
        
        // Add enhanced proportional animation effects for doughnut chart
        datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta.visible) {
            meta.data.forEach((arc, index) => {
              const value = dataset.data[index] as number;
              if (value !== null && value !== undefined) {
                const total = (dataset.data as number[]).reduce((sum, v) => sum + (v || 0), 0);
                const proportion = value / total;
                
                // Enhanced pulsing effect based on proportion
                const pulseIntensity = 0.3 + (proportion * 0.7);
                const pulseAlpha = 0.5 + (Math.sin(time * 0.002 + index * 0.5) * 0.3 * pulseIntensity);
                
                // Rotating glow effect
                const rotationSpeed = 0.001 + (proportion * 0.002);
                const glowRotation = Math.sin(time * rotationSpeed + index) * 5;
                
                // Apply enhanced proportional glow effect
                ctx.save();
                ctx.shadowColor = (dataset.backgroundColor as string) || '#000000';
                ctx.shadowBlur = 20 * proportion;
                ctx.shadowOffsetX = glowRotation;
                ctx.shadowOffsetY = glowRotation;
                ctx.globalAlpha = pulseAlpha;
                
                // Add radial gradient effect for larger proportions
                if (proportion > 0.3) {
                  const arcElement = arc as any;
                  const outerRadius = arcElement.outerRadius || 50; // Fallback radius
                  const gradient = ctx.createRadialGradient(
                    arc.x, arc.y, 0,
                    arc.x, arc.y, outerRadius
                  );
                  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
                  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
                  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                  ctx.fillStyle = gradient;
                  ctx.fill();
                }
                
                ctx.restore();
                
                // Add sparkle effect for high proportions
                if (proportion > 0.4) {
                  const sparkleCount = Math.floor(proportion * 5);
                  for (let i = 0; i < sparkleCount; i++) {
                    const sparkleAngle = (time * 0.001 + i * 0.5) % (Math.PI * 2);
                    const arcElement = arc as any;
                    const outerRadius = arcElement.outerRadius || 50; // Fallback radius
                    const sparkleRadius = outerRadius * 0.8;
                    const sparkleX = arc.x + Math.cos(sparkleAngle) * sparkleRadius;
                    const sparkleY = arc.y + Math.sin(sparkleAngle) * sparkleRadius;
                    
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.globalAlpha = Math.sin(time * 0.005 + i) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                  }
                }
              }
            });
          }
        });
      }
    }
  };
  public doughnutChartLabels: string[] = ['North Carolina', 'National'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [29.4, (100 - 29.4)], // National average (outer ring)
        backgroundColor: ['#E7F6E5', '#F8F9FA'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#374151',
        weight: 1
      },
      {
        data: [28.5, (100 - 28.5)], // State rate (inner ring) - North Carolina default
        backgroundColor: ['#075300', '#F8F9FA'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#374151',
        weight: 2
      }
    ]
  };

  // Track current state for debugging
  private currentState: string = 'North Carolina';

  ngOnInit() {
    // Subscribe to stroke mortality data changes
    this.strokeMortalitySubscription = this.strokeMortalityService.getStrokeMortalityData().subscribe(data => {
      console.log('Doughnut chart received data update:', data);
      this.updateChartData(data);
    });
    
    // Initialize with current data if available
    const currentData = this.strokeMortalityService.getCurrentStrokeMortalityData();
    if (currentData) {
      console.log('Initializing doughnut chart with current data:', currentData);
      this.updateChartData(currentData);
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.strokeMortalitySubscription) {
      this.strokeMortalitySubscription.unsubscribe();
    }
  }

  updateChartData(data: StrokeMortalityData) {
    console.log('Updating doughnut chart with data:', data);
    console.log('Current state before update:', this.currentState);
    
    // Update current state tracking
    this.currentState = data.labels[0];
    
    // Create completely new arrays to ensure change detection
    const newLabels = [...data.labels];
    const newBackgroundColors = [...data.backgroundColor];
    
    // Update chart labels
    this.doughnutChartLabels = newLabels;
    
    // Create completely new chart data object with two-layer design
    this.doughnutChartData = {
      labels: newLabels,
      datasets: [
        {
          data: [data.nationalRate, (100 - data.nationalRate)], // National average (outer ring)
          backgroundColor: ['#E7F6E5', '#F8F9FA'],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#374151',
          weight: 1
        },
        {
          data: [data.stateRate, (100 - data.stateRate)], // State rate (inner ring)
          backgroundColor: [data.backgroundColor[0], '#F8F9FA'],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#374151',
          weight: 2
        }
      ]
    };

    // Update annotation content - using type assertion to avoid TypeScript errors
    const annotations = this.doughnutChartOptions?.plugins?.annotation?.annotations as any;
    if (annotations?.label1) {
      annotations.label1.content = ['Per 100k'];
    }
    
    console.log('Doughnut chart data updated:', this.doughnutChartData);
    console.log('Chart labels:', this.doughnutChartLabels);
    console.log('Current state after update:', this.currentState);
    
    // Force change detection immediately
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    
    // Force chart to update after a brief delay
    setTimeout(() => {
      if (this.chart && this.chart.chart) {
        this.chart.chart.update('none');
        console.log('Chart manually updated');
      }
    }, 50);
  }

  // Method to force chart refresh
  forceChartRefresh() {
    console.log('Forcing chart refresh');
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    
    setTimeout(() => {
      if (this.chart && this.chart.chart) {
        this.chart.chart.update('none');
        console.log('Chart refresh completed');
      }
    }, 100);
  }
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