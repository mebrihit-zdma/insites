import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IndustryMetrics {
  industry: string;
  stateRate: number;
  nationalRate: number;
  labels: string[];
  backgroundColor: string[];
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  marketShare: number;
  growthRate: number;
  keyMetrics: {
    revenue: number;
    patients: number;
    efficiency: number;
    satisfaction: number;
  };
}

export interface IndustryTrend {
  date: string;
  value: number;
  industry: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndustryDataService {
  private industryMetricsSubject = new BehaviorSubject<IndustryMetrics[]>([]);
  private industryTrendsSubject = new BehaviorSubject<IndustryTrend[]>([]);
  private selectedIndustrySubject = new BehaviorSubject<string>('Healthcare');

  constructor() { }

  // Get industry metrics
  getIndustryMetrics(): Observable<IndustryMetrics[]> {
    return this.industryMetricsSubject.asObservable();
  }

  // Get industry trends
  getIndustryTrends(): Observable<IndustryTrend[]> {
    return this.industryTrendsSubject.asObservable();
  }

  // Get selected industry
  getSelectedIndustry(): Observable<string> {
    return this.selectedIndustrySubject.asObservable();
  }

  // Update industry metrics
  updateIndustryMetrics(metrics: IndustryMetrics[]) {
    this.industryMetricsSubject.next(metrics);
  }

  // Update industry trends
  updateIndustryTrends(trends: IndustryTrend[]) {
    this.industryTrendsSubject.next(trends);
  }

  // Update selected industry
  updateSelectedIndustry(industry: string) {
    this.selectedIndustrySubject.next(industry);
  }

  // Get current values
  getCurrentIndustryMetrics(): IndustryMetrics[] {
    return this.industryMetricsSubject.value;
  }

  getCurrentIndustryTrends(): IndustryTrend[] {
    return this.industryTrendsSubject.value;
  }

  getCurrentSelectedIndustry(): string {
    return this.selectedIndustrySubject.value;
  }
}
