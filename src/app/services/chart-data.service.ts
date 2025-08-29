import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChartDataPoint {
  date: string;
  speech: number;
  vision: number;
  cognitive?: number;
  motor?: number;
}

export interface StateChartData {
  [state: string]: ChartDataPoint[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private chartDataSubject = new BehaviorSubject<ChartDataPoint[]>([]);
  private currentStateSubject = new BehaviorSubject<string>('North Carolina');

  // Statistical healthcare customer needs data with quarterly granularity and realistic variations
  private stateChartData: StateChartData = {
    'North Carolina': [
      { date: 'Q1 2022', speech: 8.5, vision: 12.3 },
      { date: 'Q2 2022', speech: 9.8, vision: 13.7 },
      { date: 'Q3 2022', speech: 10.2, vision: 14.9 },
      { date: 'Q4 2022', speech: 11.2, vision: 15.7 },
      { date: 'Q1 2023', speech: 12.4, vision: 16.8 },
      { date: 'Q2 2023', speech: 13.6, vision: 18.1 },
      { date: 'Q3 2023', speech: 14.8, vision: 19.4 },
      { date: 'Q4 2023', speech: 16.2, vision: 21.3 },
      { date: 'Q1 2024', speech: 18.6, vision: 23.1 },
      { date: 'Q2 2024', speech: 20.4, vision: 25.2 },
      { date: 'Q3 2024', speech: 22.3, vision: 27.8 },
      { date: 'Q4 2024', speech: 24.5, vision: 30.1 },
      { date: 'Q1 2025', speech: 26.7, vision: 32.5 },
      { date: 'Q2 2025', speech: 28.9, vision: 35.2 },
      { date: 'Q3 2025', speech: 31.2, vision: 37.9 }
    ],
    'Florida': [
      { date: 'Q1 2022', speech: 10.1, vision: 14.2 },
      { date: 'Q2 2022', speech: 11.3, vision: 15.6 },
      { date: 'Q3 2022', speech: 12.1, vision: 16.7 },
      { date: 'Q4 2022', speech: 13.4, vision: 17.8 },
      { date: 'Q1 2023', speech: 14.8, vision: 19.1 },
      { date: 'Q2 2023', speech: 15.9, vision: 20.3 },
      { date: 'Q3 2023', speech: 17.2, vision: 21.5 },
      { date: 'Q4 2023', speech: 18.7, vision: 23.2 },
      { date: 'Q1 2024', speech: 21.8, vision: 25.9 },
      { date: 'Q2 2024', speech: 23.4, vision: 27.8 },
      { date: 'Q3 2024', speech: 25.6, vision: 30.2 },
      { date: 'Q4 2024', speech: 27.3, vision: 32.1 },
      { date: 'Q1 2025', speech: 29.3, vision: 35.1 },
      { date: 'Q2 2025', speech: 31.5, vision: 37.4 },
      { date: 'Q3 2025', speech: 33.7, vision: 39.8 }
    ],
    'Texas': [
      { date: 'Q1 2022', speech: 7.8, vision: 11.5 },
      { date: 'Q2 2022', speech: 8.9, vision: 12.8 },
      { date: 'Q3 2022', speech: 9.7, vision: 13.6 },
      { date: 'Q4 2022', speech: 10.9, vision: 14.8 },
      { date: 'Q1 2023', speech: 12.1, vision: 16.2 },
      { date: 'Q2 2023', speech: 13.2, vision: 17.5 },
      { date: 'Q3 2023', speech: 14.2, vision: 18.3 },
      { date: 'Q4 2023', speech: 15.8, vision: 19.9 },
      { date: 'Q1 2024', speech: 17.9, vision: 22.1 },
      { date: 'Q2 2024', speech: 19.6, vision: 24.3 },
      { date: 'Q3 2024', speech: 21.4, vision: 26.7 },
      { date: 'Q4 2024', speech: 23.1, vision: 28.9 },
      { date: 'Q1 2025', speech: 24.8, vision: 31.2 },
      { date: 'Q2 2025', speech: 26.7, vision: 33.5 },
      { date: 'Q3 2025', speech: 28.5, vision: 35.9 }
    ],
    'Illinois': [
      { date: 'Q1 2022', speech: 9.2, vision: 13.1 },
      { date: 'Q2 2022', speech: 10.4, vision: 14.5 },
      { date: 'Q3 2022', speech: 11.2, vision: 15.3 },
      { date: 'Q4 2022', speech: 12.1, vision: 16.4 },
      { date: 'Q1 2023', speech: 13.5, vision: 17.8 },
      { date: 'Q2 2023', speech: 14.6, vision: 19.1 },
      { date: 'Q3 2023', speech: 15.7, vision: 20.2 },
      { date: 'Q4 2023', speech: 17.1, vision: 22.1 },
      { date: 'Q1 2024', speech: 19.3, vision: 24.6 },
      { date: 'Q2 2024', speech: 21.2, vision: 26.7 },
      { date: 'Q3 2024', speech: 23.1, vision: 28.9 },
      { date: 'Q4 2024', speech: 24.9, vision: 31.1 },
      { date: 'Q1 2025', speech: 26.8, vision: 33.4 },
      { date: 'Q2 2025', speech: 28.7, vision: 35.8 },
      { date: 'Q3 2025', speech: 30.6, vision: 38.1 }
    ],
    'Virginia': [
      { date: 'Q1 2022', speech: 6.9, vision: 10.8 },
      { date: 'Q2 2022', speech: 7.8, vision: 11.9 },
      { date: 'Q3 2022', speech: 8.5, vision: 12.7 },
      { date: 'Q4 2022', speech: 9.7, vision: 13.9 },
      { date: 'Q1 2023', speech: 10.9, vision: 15.2 },
      { date: 'Q2 2023', speech: 11.8, vision: 16.4 },
      { date: 'Q3 2023', speech: 12.8, vision: 17.2 },
      { date: 'Q4 2023', speech: 14.2, vision: 18.9 },
      { date: 'Q1 2024', speech: 16.4, vision: 20.8 },
      { date: 'Q2 2024', speech: 18.1, vision: 22.9 },
      { date: 'Q3 2024', speech: 19.7, vision: 25.1 },
      { date: 'Q4 2024', speech: 21.4, vision: 27.3 },
      { date: 'Q1 2025', speech: 23.2, vision: 29.6 },
      { date: 'Q2 2025', speech: 25.1, vision: 31.9 },
      { date: 'Q3 2025', speech: 26.9, vision: 34.3 }
    ]
  };

  constructor() { 
    // Initialize with default data
    this.updateChartDataForCurrentState();
  }

  // Observable for chart data
  getChartData(): Observable<ChartDataPoint[]> {
    return this.chartDataSubject.asObservable();
  }

  // Observable for current state
  getCurrentState(): Observable<string> {
    return this.currentStateSubject.asObservable();
  }

  // Update chart data
  updateChartData(data: ChartDataPoint[]) {
    this.chartDataSubject.next(data);
  }

  // Update current state
  updateCurrentState(state: string) {
    this.currentStateSubject.next(state);
  }

  // Get current chart data value
  getCurrentChartData(): ChartDataPoint[] {
    return this.chartDataSubject.value;
  }

  // Get current state value
  getCurrentStateValue(): string {
    return this.currentStateSubject.value;
  }

  // Get chart data for a specific state
  getChartDataForState(state: string): ChartDataPoint[] {
    return this.stateChartData[state] || this.stateChartData['North Carolina'];
  }

  // Update chart data for current state
  updateChartDataForCurrentState() {
    const currentState = this.currentStateSubject.value;
    const data = this.getChartDataForState(currentState);
    this.chartDataSubject.next(data);
  }
}
