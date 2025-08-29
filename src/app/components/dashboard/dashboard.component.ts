import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
// import { SummaryCardComponent } from '../../components/cards/summary-card/summary-card.component';
import { InsitesCardComponent } from '../../components/cards/insites-card/insites-card.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserService } from '../../services/user.service';
import { OnboardingService } from '../../services/onboarding.service';
import { TooltipService } from '../../services/tooltip.service';

import { ChartDataService, ChartDataPoint } from '../../services/chart-data.service';
import { StrokeMortalityService } from '../../services/stroke-mortality.service';
import { IndustryDataService, IndustryMetrics, IndustryTrend } from '../../services/industry-data.service';
import { Router } from '@angular/router';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { StackedareaChartComponent } from '../stackedarea-chart/stackedarea-chart.component';
import { BarChartComponent } from '../barchart/barchart.component';
import { CardData } from '../../models/insites.card.model'
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, InsitesCardComponent, NgxChartsModule, BarChartComponent, StackedareaChartComponent, DoughnutChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    constructor(
    private userService: UserService, 
    private tooltipService: TooltipService,  
    private chartDataService: ChartDataService,
    private strokeMortalityService: StrokeMortalityService,
    private industryDataService: IndustryDataService,
    private router: Router, 
    private onboardingService: OnboardingService 
  ) {}

  listNumber = 2;
  userName: string | null = 'User Name';
  userRole: string | null = 'Marketing Manager';
  
  // Integration data storage
  integrationData: any = null;
  lastDataUpdate: Date | null = null;

 
  products = [
    "North Carolina",
    "Florida", 
    "Texas",
    "Illinois",
    "Virginia"
  ]

  selectedState: string = this.products[0];
  personaWidgetList: string[] = [];
  selectedWidgetList: string[] = [];
  selectedCustomizeWidgets: string[] = [];
  selectedIndex:number = 0;

  ngOnInit() {
    console.log('Dashboard component initialized!');
    
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });

    this.personaWidgetList = this.onboardingService.getPersonaWidgetList()
    this.selectedWidgetList = this.onboardingService.getSelectedWidgetList()
    
    // Initialize chart data for the default state
    this.updateChartDataForState(this.selectedState);
    
    // Initialize stroke mortality data for the default state
    this.updateStrokeMortalityDataForState(this.selectedState);
    
    // Initialize industry data for the default state and industry
    this.updateIndustryMetricsForState(this.selectedState, this.selectedIndustry);

    // Listen for custom event from insites-card component
    window.addEventListener('openInsitesChat', () => {
      this.openMiniChatbot();
    });

    // Listen for integration data uploads
    window.addEventListener('integrationDataUploaded', (event: any) => {
      this.handleIntegrationDataUpload(event.detail);
    });

    // Listen for file data from integrations page
    window.addEventListener('fileDataForDashboard', (event: any) => {
      console.log('Dashboard received file data:', event.detail);
      this.handleFileDataForDashboard(event.detail);
    });
  }

  isProductDropdownOpen = false;
  isFilterDropdownOpen = false;

  // Filter data and functionality
  filterData = {
    dateFrom: '',
    dateTo: '',
    status: '',
    priority: []
  };

  filterCategories = [
    { name: 'Speech', selected: true },
    { name: 'Vision', selected: true },
    { name: 'Cognitive', selected: false },
    { name: 'Motor', selected: false },
    { name: 'Sensory', selected: false }
  ];

  filterPriorities = [
    { name: 'High', selected: false },
    { name: 'Medium', selected: true },
    { name: 'Low', selected: false }
  ];

  // Sample filtered data
  filteredCardData: any[] = [];
  filteredChartData: any[] = [];

  // Industry-specific data
  industries = ['Healthcare', 'Finance', 'Technology', 'Manufacturing', 'Retail', 'Education'];
  selectedIndustry = 'Healthcare';

  // Industry-specific metrics for each state
  industryMetrics: { [key: string]: { [industry: string]: IndustryMetrics } } = {
    "North Carolina": {
      "Healthcare": {
        industry: "Healthcare",
        stateRate: 28.5,
        nationalRate: 29.4,
        labels: ['North Carolina', 'National'],
        backgroundColor: ['#075300', '#E7F6E5'],
        trend: 'up',
        riskLevel: 'medium',
        marketShare: 15.2,
        growthRate: 8.5,
        keyMetrics: { revenue: 1250000, patients: 8500, efficiency: 87, satisfaction: 92 }
      },
      "Finance": {
        industry: "Finance",
        stateRate: 32.1,
        nationalRate: 30.8,
        labels: ['North Carolina', 'National'],
        backgroundColor: ['#1E40AF', '#DBEAFE'],
        trend: 'up',
        riskLevel: 'low',
        marketShare: 12.8,
        growthRate: 12.3,
        keyMetrics: { revenue: 2100000, patients: 12000, efficiency: 94, satisfaction: 89 }
      },
      "Technology": {
        industry: "Technology",
        stateRate: 25.7,
        nationalRate: 28.2,
        labels: ['North Carolina', 'National'],
        backgroundColor: ['#7C3AED', '#EDE9FE'],
        trend: 'stable',
        riskLevel: 'medium',
        marketShare: 18.5,
        growthRate: 15.7,
        keyMetrics: { revenue: 1800000, patients: 9500, efficiency: 91, satisfaction: 88 }
      }
    },
    "Florida": {
      "Healthcare": {
        industry: "Healthcare",
        stateRate: 32.8,
        nationalRate: 29.4,
        labels: ['Florida', 'National Average'],
        backgroundColor: ['#4ABB40', '#E7F6E5'],
        trend: 'up',
        riskLevel: 'high',
        marketShare: 22.1,
        growthRate: 11.2,
        keyMetrics: { revenue: 1850000, patients: 12500, efficiency: 85, satisfaction: 90 }
      },
      "Finance": {
        industry: "Finance",
        stateRate: 29.5,
        nationalRate: 30.8,
        labels: ['Florida', 'National Average'],
        backgroundColor: ['#1E40AF', '#DBEAFE'],
        trend: 'down',
        riskLevel: 'medium',
        marketShare: 16.3,
        growthRate: 6.8,
        keyMetrics: { revenue: 1650000, patients: 9800, efficiency: 88, satisfaction: 85 }
      },
      "Technology": {
        industry: "Technology",
        stateRate: 31.2,
        nationalRate: 28.2,
        labels: ['Florida', 'National Average'],
        backgroundColor: ['#7C3AED', '#EDE9FE'],
        trend: 'up',
        riskLevel: 'medium',
        marketShare: 14.7,
        growthRate: 18.9,
        keyMetrics: { revenue: 1450000, patients: 8200, efficiency: 93, satisfaction: 91 }
      }
    },
    "Texas": {
      "Healthcare": {
        industry: "Healthcare",
        stateRate: 26.2,
        nationalRate: 29.4,
        labels: ['Texas', 'National Average'],
        backgroundColor: ['#075300', '#E7F6E5'],
        trend: 'stable',
        riskLevel: 'low',
        marketShare: 19.8,
        growthRate: 7.3,
        keyMetrics: { revenue: 1950000, patients: 13500, efficiency: 89, satisfaction: 87 }
      },
      "Finance": {
        industry: "Finance",
        stateRate: 33.7,
        nationalRate: 30.8,
        labels: ['Texas', 'National Average'],
        backgroundColor: ['#1E40AF', '#DBEAFE'],
        trend: 'up',
        riskLevel: 'low',
        marketShare: 21.4,
        growthRate: 14.2,
        keyMetrics: { revenue: 2250000, patients: 14200, efficiency: 92, satisfaction: 88 }
      },
      "Technology": {
        industry: "Technology",
        stateRate: 27.8,
        nationalRate: 28.2,
        labels: ['Texas', 'National Average'],
        backgroundColor: ['#7C3AED', '#EDE9FE'],
        trend: 'up',
        riskLevel: 'medium',
        marketShare: 16.9,
        growthRate: 16.5,
        keyMetrics: { revenue: 1680000, patients: 9200, efficiency: 90, satisfaction: 89 }
      }
    },
    "Illinois": {
      "Healthcare": {
        industry: "Healthcare",
        stateRate: 31.7,
        nationalRate: 29.4,
        labels: ['Illinois', 'National Average'],
        backgroundColor: ['#4ABB40', '#E7F6E5'],
        trend: 'down',
        riskLevel: 'high',
        marketShare: 17.6,
        growthRate: 4.2,
        keyMetrics: { revenue: 1450000, patients: 9800, efficiency: 83, satisfaction: 84 }
      },
      "Finance": {
        industry: "Finance",
        stateRate: 28.9,
        nationalRate: 30.8,
        labels: ['Illinois', 'National Average'],
        backgroundColor: ['#1E40AF', '#DBEAFE'],
        trend: 'stable',
        riskLevel: 'medium',
        marketShare: 18.7,
        growthRate: 8.9,
        keyMetrics: { revenue: 1780000, patients: 10500, efficiency: 87, satisfaction: 86 }
      },
      "Technology": {
        industry: "Technology",
        stateRate: 29.4,
        nationalRate: 28.2,
        labels: ['Illinois', 'National Average'],
        backgroundColor: ['#7C3AED', '#EDE9FE'],
        trend: 'up',
        riskLevel: 'medium',
        marketShare: 15.3,
        growthRate: 12.8,
        keyMetrics: { revenue: 1320000, patients: 7800, efficiency: 89, satisfaction: 87 }
      }
    },
    "Virginia": {
      "Healthcare": {
        industry: "Healthcare",
        stateRate: 27.3,
        nationalRate: 29.4,
        labels: ['Virginia', 'National Average'],
        backgroundColor: ['#075300', '#E7F6E5'],
        trend: 'stable',
        riskLevel: 'low',
        marketShare: 13.4,
        growthRate: 6.7,
        keyMetrics: { revenue: 1120000, patients: 7200, efficiency: 91, satisfaction: 89 }
      },
      "Finance": {
        industry: "Finance",
        stateRate: 31.5,
        nationalRate: 30.8,
        labels: ['Virginia', 'National Average'],
        backgroundColor: ['#1E40AF', '#DBEAFE'],
        trend: 'up',
        riskLevel: 'low',
        marketShare: 14.2,
        growthRate: 10.1,
        keyMetrics: { revenue: 1350000, patients: 8500, efficiency: 93, satisfaction: 90 }
      },
      "Technology": {
        industry: "Technology",
        stateRate: 26.9,
        nationalRate: 28.2,
        labels: ['Virginia', 'National Average'],
        backgroundColor: ['#7C3AED', '#EDE9FE'],
        trend: 'stable',
        riskLevel: 'medium',
        marketShare: 12.8,
        growthRate: 9.4,
        keyMetrics: { revenue: 980000, patients: 6200, efficiency: 88, satisfaction: 85 }
      }
    }
  };

  // State-specific data structure
  stateData: { [key: string]: { cards: any[], chartData: ChartDataPoint[], strokeMortality: any } } = {
    "North Carolina": {
      cards: [
        { label: "Cognitive", data: "17", heading: "Top Dx in", category: "Cognitive", status: "active", priority: "High", date: "2024-01-15" },
        { label: "Dementia", data: "14", heading: "Top Dx in", category: "Cognitive", status: "active", priority: "Medium", date: "2024-01-20" },
        { label: "479K", data: "10", heading: "Caregivers in", category: "Support", status: "pending", priority: "Low", date: "2024-01-25" }
      ],
      chartData: [
        { date: "Jan 2022", speech: 15, vision: 12, cognitive: 8, motor: 5 },
        { date: "Jun 2022", speech: 18, vision: 16, cognitive: 10, motor: 7 },
        { date: "Jan 2023", speech: 22, vision: 20, cognitive: 12, motor: 9 },
        { date: "Jun 2023", speech: 25, vision: 24, cognitive: 15, motor: 11 },
        { date: "Jan 2024", speech: 28, vision: 28, cognitive: 18, motor: 13 },
        { date: "Jun 2024", speech: 32, vision: 32, cognitive: 22, motor: 16 },
        { date: "Jan 2025", speech: 35, vision: 36, cognitive: 25, motor: 18 }
      ],
      strokeMortality: {
        stateRate: 28.5,
        nationalRate: 29.4,
        labels: ['North Carolina', 'National'],
        backgroundColor: ['#075300', '#E7F6E5']
      }
    },
    "Florida": {
      cards: [
        { label: "Stroke", data: "18.5", heading: "Top Dx in", category: "Neurological", status: "active", priority: "High", date: "2024-01-15" },
        { label: "Dementia", data: "15", heading: "#2 Dx in", category: "Cognitive", status: "active", priority: "Medium", date: "2024-01-20" },
        { label: "806K", data: "27", heading: "Caregivers in", category: "Support", status: "pending", priority: "Low", date: "2024-01-25" }
      ],
      chartData: [
        { date: "Jan 2022", speech: 12, vision: 15, cognitive: 10, motor: 8 },
        { date: "Jun 2022", speech: 15, vision: 18, cognitive: 12, motor: 10 },
        { date: "Jan 2023", speech: 18, vision: 22, cognitive: 15, motor: 12 },
        { date: "Jun 2023", speech: 22, vision: 26, cognitive: 18, motor: 15 },
        { date: "Jan 2024", speech: 26, vision: 30, cognitive: 22, motor: 18 },
        { date: "Jun 2024", speech: 30, vision: 34, cognitive: 26, motor: 21 },
        { date: "Jan 2025", speech: 34, vision: 38, cognitive: 30, motor: 24 }
      ],
      strokeMortality: {
        stateRate: 32.8,
        nationalRate: 29.4,
        labels: ['Florida', 'National'],
        backgroundColor: ['#4ABB40', '#E7F6E5']
      }
    },
    "Texas": {
      cards: [
        { label: "Alzheimer's", data: "15", heading: "Top Dx in", category: "Cognitive", status: "active", priority: "High", date: "2024-01-15" },
        { label: "Dementia", data: "8", heading: "#2 Dx in", category: "Cognitive", status: "active", priority: "Medium", date: "2024-01-20" },
        { label: "910K", data: "35", heading: "Caregivers in", category: "Support", status: "pending", priority: "Low", date: "2024-01-25" }
      ],
      chartData: [
        { date: "Jan 2022", speech: 18, vision: 14, cognitive: 12, motor: 6 },
        { date: "Jun 2022", speech: 21, vision: 17, cognitive: 15, motor: 8 },
        { date: "Jan 2023", speech: 24, vision: 20, cognitive: 18, motor: 10 },
        { date: "Jun 2023", speech: 27, vision: 23, cognitive: 21, motor: 12 },
        { date: "Jan 2024", speech: 30, vision: 26, cognitive: 24, motor: 14 },
        { date: "Jun 2024", speech: 33, vision: 29, cognitive: 27, motor: 16 },
        { date: "Jan 2025", speech: 36, vision: 32, cognitive: 30, motor: 18 }
      ],
      strokeMortality: {
        stateRate: 26.2,
        nationalRate: 29.4,
        labels: ['Texas', 'National'],
        backgroundColor: ['#075300', '#E7F6E5']
      }
    },
    "Illinois": {
      cards: [
        { label: "Parkinson's", data: "20", heading: "Top Dx in", category: "Neurological", status: "active", priority: "High", date: "2024-01-15" },
        { label: "Cognitive", data: "14", heading: "#2 Dx in", category: "Cognitive", status: "active", priority: "Medium", date: "2024-01-20" },
        { label: "759K", data: "22", heading: "Caregivers in", category: "Support", status: "pending", priority: "Low", date: "2024-01-25" }
      ],
      chartData: [
        { date: "Jan 2022", speech: 14, vision: 18, cognitive: 11, motor: 9 },
        { date: "Jun 2022", speech: 17, vision: 21, cognitive: 14, motor: 11 },
        { date: "Jan 2023", speech: 20, vision: 24, cognitive: 17, motor: 13 },
        { date: "Jun 2023", speech: 23, vision: 27, cognitive: 20, motor: 15 },
        { date: "Jan 2024", speech: 26, vision: 30, cognitive: 23, motor: 17 },
        { date: "Jun 2024", speech: 29, vision: 33, cognitive: 26, motor: 19 },
        { date: "Jan 2025", speech: 32, vision: 36, cognitive: 29, motor: 21 }
      ],
      strokeMortality: {
        stateRate: 31.7,
        nationalRate: 29.4,
        labels: ['Illinois', 'National'],
        backgroundColor: ['#4ABB40', '#E7F6E5']
      }
    },
    "Virginia": {
      cards: [
        { label: "Stroke", data: "17", heading: "Top Dx in", category: "Neurological", status: "active", priority: "High", date: "2024-01-15" },
        { label: "Cognitive", data: "15", heading: "#2 Dx in", category: "Cognitive", status: "active", priority: "Medium", date: "2024-01-20" },
        { label: "600K", data: "28", heading: "Caregivers in", category: "Support", status: "pending", priority: "Low", date: "2024-01-25" }
      ],
      chartData: [
        { date: "Jan 2022", speech: 16, vision: 13, cognitive: 9, motor: 7 },
        { date: "Jun 2022", speech: 19, vision: 16, cognitive: 12, motor: 9 },
        { date: "Jan 2023", speech: 22, vision: 19, cognitive: 15, motor: 11 },
        { date: "Jun 2023", speech: 25, vision: 22, cognitive: 18, motor: 13 },
        { date: "Jan 2024", speech: 28, vision: 25, cognitive: 21, motor: 15 },
        { date: "Jun 2024", speech: 31, vision: 28, cognitive: 24, motor: 17 },
        { date: "Jan 2025", speech: 34, vision: 31, cognitive: 27, motor: 19 }
      ],
      strokeMortality: {
        stateRate: 27.3,
        nationalRate: 29.4,
        labels: ['Virginia', 'National'],
        backgroundColor: ['#075300', '#E7F6E5']
      }
    }
  };

  // Sample data for filtering demonstration (keeping for backward compatibility)
  sampleData = {
    cards: this.stateData["North Carolina"].cards,
    chartData: this.stateData["North Carolina"].chartData
  };

  toggleProductDropdown() {
    console.log('Toggle dropdown clicked, current state:', this.isProductDropdownOpen);
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
    console.log('New state:', this.isProductDropdownOpen);
  }



  selectProduct(product: string, index: number) {
    this.selectedState = product;
    this.selectedIndex = index;
    this.isProductDropdownOpen = false;
    
    // Update sample data to reflect selected state
    this.sampleData = {
      cards: this.stateData[product].cards,
      chartData: this.stateData[product].chartData
    };
    
    // Clear any existing filters when state changes
    this.clearFilters();
    
    // Update chart data for the new state
    this.updateChartDataForState(product);
    
    // Update stroke mortality data for the new state
    this.updateStrokeMortalityDataForState(product);
    
    // Update industry metrics for the new state and current industry
    this.updateIndustryMetricsForState(product, this.selectedIndustry);
  }

  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  toggleCategory(category: any) {
    category.selected = !category.selected;
  }

  togglePriority(priority: any) {
    priority.selected = !priority.selected;
  }

  applyFilters() {
    // Apply filters to data
    this.filteredCardData = this.applyFiltersToData(this.sampleData.cards);
    this.filteredChartData = this.applyFiltersToChartData();
    
    // Update chart data service with filtered data
    this.chartDataService.updateChartData(this.filteredChartData);
    
    // Close dropdown
    this.isFilterDropdownOpen = false;
    
    // Show success message
    this.showFilterSuccessMessage();
  }

  updateChartDataForState(state: string) {
    // Update the chart data service with enhanced data
    this.chartDataService.updateCurrentState(state);
    this.chartDataService.updateChartDataForCurrentState();
    
    console.log('Updating chart data for state:', state);
    
    // Update filtered chart data
    this.filteredChartData = this.chartDataService.getCurrentChartData();
  }

  updateStrokeMortalityDataForState(state: string) {
    // Update stroke mortality data based on selected state
    const stateStrokeMortalityData = this.stateData[state].strokeMortality;
    
    console.log('Dashboard updating stroke mortality for state:', state);
    console.log('Stroke mortality data:', stateStrokeMortalityData);
    
    // Update the stroke mortality service
    this.strokeMortalityService.updateStrokeMortalityData(stateStrokeMortalityData);
    
    console.log('Updating stroke mortality data for state:', state, stateStrokeMortalityData);
  }

  // Industry-specific methods
  selectIndustry(industry: string) {
    this.selectedIndustry = industry;
    this.industryDataService.updateSelectedIndustry(industry);
    
    // Update industry metrics for current state
    this.updateIndustryMetricsForState(this.selectedState, industry);
    
    console.log('Industry selected:', industry);
  }

  updateIndustryMetricsForState(state: string, industry: string) {
    const metrics = this.industryMetrics[state]?.[industry];
    if (metrics) {
      // Update industry data service
      this.industryDataService.updateIndustryMetrics([metrics]);
      
      // Update stroke mortality data with industry-specific data
      const industryStrokeMortalityData = {
        stateRate: metrics.stateRate,
        nationalRate: metrics.nationalRate,
        labels: metrics.labels,
        backgroundColor: metrics.backgroundColor
      };
      
      this.strokeMortalityService.updateStrokeMortalityData(industryStrokeMortalityData);
      
      console.log('Updated industry metrics for state:', state, 'industry:', industry, metrics);
    }
  }

  getIndustryTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      case 'stable': return 'trending_flat';
      default: return 'trending_flat';
    }
  }

  getRiskLevelColor(riskLevel: 'low' | 'medium' | 'high'): string {
    switch (riskLevel) {
      case 'low': return '#10B981'; // green
      case 'medium': return '#F59E0B'; // yellow
      case 'high': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  }

  getIndustryIcon(industry: string): string {
    switch (industry) {
      case 'Healthcare': return 'local_hospital';
      case 'Finance': return 'account_balance';
      case 'Technology': return 'computer';
      case 'Manufacturing': return 'factory';
      case 'Retail': return 'shopping_cart';
      case 'Education': return 'school';
      default: return 'business';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  clearFilters() {
    // Reset all filters
    this.filterData = {
      dateFrom: '',
      dateTo: '',
      status: '',
      priority: []
    };

    this.filterCategories.forEach(category => {
      category.selected = category.name === 'Speech' || category.name === 'Vision';
    });

    this.filterPriorities.forEach(priority => {
      priority.selected = priority.name === 'Medium';
    });

    // Reset filtered data to current state data
    this.filteredCardData = [];
    this.filteredChartData = this.stateData[this.selectedState].chartData;

    // Update chart data service with unfiltered data
    this.chartDataService.updateChartData(this.filteredChartData);

    // Update stroke mortality data for current state
    this.updateStrokeMortalityDataForState(this.selectedState);

    // Close dropdown
    this.isFilterDropdownOpen = false;
    
    console.log('Filters cleared, restored data for state:', this.selectedState);
  }

  private applyFiltersToData(data: any[]): any[] {
    // Apply filters to card data
    let filtered = [...data];

    // Filter by date range if specified
    if (this.filterData.dateFrom || this.filterData.dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = this.filterData.dateFrom ? new Date(this.filterData.dateFrom) : null;
        const toDate = this.filterData.dateTo ? new Date(this.filterData.dateTo) : null;
        
        if (fromDate && toDate) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          return itemDate >= fromDate;
        } else if (toDate) {
          return itemDate <= toDate;
        }
        return true;
      });
    }

    // Filter by status if specified
    if (this.filterData.status) {
      filtered = filtered.filter(item => item.status === this.filterData.status);
    }

    // Filter by selected categories
    const selectedCategories = this.filterCategories.filter(cat => cat.selected).map(cat => cat.name);
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by selected priorities
    const selectedPriorities = this.filterPriorities.filter(pri => pri.selected).map(pri => pri.name);
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(item => selectedPriorities.includes(item.priority));
    }

    console.log('Filtered data:', filtered);
    return filtered;
  }

  private applyFiltersToChartData(): any[] {
    // Apply filters to chart data
    let filtered = [...this.sampleData.chartData];

    // Filter by date range if specified
    if (this.filterData.dateFrom || this.filterData.dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = this.filterData.dateFrom ? new Date(this.filterData.dateFrom) : null;
        const toDate = this.filterData.dateTo ? new Date(this.filterData.dateTo) : null;
        
        if (fromDate && toDate) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          return itemDate >= fromDate;
        } else if (toDate) {
          return itemDate <= toDate;
        }
        return true;
      });
    }

    // Filter by selected categories
    const selectedCategories = this.filterCategories.filter(cat => cat.selected).map(cat => cat.name.toLowerCase());
    if (selectedCategories.length > 0) {
      filtered = filtered.map(item => {
        const filteredItem: any = { date: item.date };
        selectedCategories.forEach(category => {
          if ((item as any)[category] !== undefined) {
            filteredItem[category] = (item as any)[category];
          }
        });
        return filteredItem;
      });
    }

    console.log('Filtered chart data:', filtered);
    return filtered;
  }

  private showFilterSuccessMessage() {
    // Show a success message when filters are applied
    console.log('Filters applied successfully!');
    // You could implement a toast notification here
  }

  hasActiveFilters(): boolean {
    // Check if any filters are active
    const hasDateFilter = !!(this.filterData.dateFrom || this.filterData.dateTo);
    const hasStatusFilter = this.filterData.status !== '';
    const hasCategoryFilter = this.filterCategories.some(cat => cat.selected);
    const hasPriorityFilter = this.filterPriorities.some(pri => pri.selected);
    
    return hasDateFilter || hasStatusFilter || hasCategoryFilter || hasPriorityFilter;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdowns when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isFilterDropdownOpen = false;
      this.isProductDropdownOpen = false;
    }
  }
  // cards 

   carddata: CardData[][] =[[
        { label: "Cognitive", data:"17",heading:"Top Dx in" },
         { label: "Dementia", data:"14",heading:"Top Dx in" },
         { label: "479K", data:"10",heading:"Caregivers in" },
      ],[
        { label: "Stroke", data:"18.5",heading:"Top Dx in" },
         { label: "Dementia", data:"15",heading:"#2 Dx in" },
         { label: "806K", data:"27",heading:"Caregivers in" },
      ],[
        { label: "Alzheimer's", data:"15",heading:"Top Dx in" },
         { label: "Dementia", data:"8",heading:"#2 Dx in" },
         { label: "910K", data:"35" ,heading:"Caregivers in"},
      ],[
        { label: "Parkinson's", data:"20",heading:"Top Dx in"},
         { label: "Cognitive", data:"14",heading:"#2 Dx in" },
         { label: "759K", data:"22",heading:"Caregivers in" },
      ],[
        { label: "Stroke", data:"17" ,heading:"Top Dx in" },
         { label: "Cognitive", data:"15",heading:"#2 Dx in" },
         { label: "600K", data:"28",heading:"Caregivers in" },
      ]];
  productLatestUpdates = [
    { 
      latestUpdate: "7th March, 2025", 
      title: "Latest Updates in the product", 
      subTitle:"Enhanced transaction security to prevent unauthorized access.",
      updateList: [
        "Improved API response times by 30% for better performance.",
        "Introduced a new fraud detection feature to minimize risk.",
      ],
      moreInfo:"View More",
      latest:"Latest"
    },
  ]
  releaseNotesSummary = [
    { 
      latestUpdate: "2nd March, 2025", 
      title: "Release Notes Summary", 
      subTitle:"Added batch processing for large transactions to increase efficiency.",
      updateList: [
        "Improved error logging to simplify troubleshooting for failed payments.",
        "Added support for Instant Payments in new regions, including SEPA Instant Credit Transfer.",
      ],
      moreInfo:"View Summary"
    },
    { 
      latestUpdate: "2nd March, 2025", 
      title: "Release Notes Summary", 
      subTitle:"Added batch processing for large transactions to increase efficiency.",
      updateList: [
        "Improved error logging to simplify troubleshooting for failed payments.",
        "Added support for Instant Payments in new regions, including SEPA Instant Credit Transfer.",
      ],
      moreInfo:"View Summary"
    },
    { 
      latestUpdate: "2nd March, 2025", 
      title: "Release Notes Summary", 
      subTitle:"Added batch processing for large transactions to increase efficiency.",
      updateList: [
        "Improved error logging to simplify troubleshooting for failed payments.",
        "Added support for Instant Payments in new regions, including SEPA Instant Credit Transfer.",
      ],
      moreInfo:"View Summary"
    },
  ]
  categoryData = [
    { 
      title: "Total Bug Raised", 
      bugNumber: "12", 
      month:"This month"
    },
    { 
      title: "User Engagement Metrics", 
      bugNumber: "80%", 
      month:"Customer Satisfaction Rate"
    }
  ]
  pieData = [
    {
      title:'Total Bugs Raised', 
      view: [140, 140] as [number, number],
      pieChartData: [
        { name: 'Critical', value: 6, color:'#6A94E5'},
        { name: 'High', value: 2, color:'#C1D3FA'},
        { name: 'Others', value: 4, color:'#1F4BB9'},
      ],
      customColors: [
        { name: 'Critical', value: '#6A94E5' },
        { name: 'High', value: '#C1D3FA' },
        { name: 'Others', value: '#1F4BB9' },
      ]
    }
  ]

  // release history data 
  releaseHistory = [
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "Release Notes",
      status: "In Progress",
      deliveryDate: "Jan 02, 2025",
      executedBy: "Gulse",
      view: "",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "Release Notes",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Jeannie",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
  ];

  // bug fixes data 
  bugFixes = [
    { issue: "SBI-323", 
      description: "Slow loading times", 
      priority: "Low",
      status: "Fix In Progress",
      assignedTo: "Adam",
      viewResolution: "",
    },
    { issue: "SBI-321", 
      description: "Payment approval delays for high volume", 
      priority: "Highest",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
  ];
  
  // tooltip
  skipTooltipValue = false;
  aciPaymentHubTooltip = false;
  createDocTooltip = false;
  startNewChatTooltip = false;

  dashboardModelDone = false;
  aciPaymentHubTooltipDone = false;
  createDocTooltipDone = false;
  startNewChatTooltipDone = false;

  skipTooltip(){
    this.skipTooltipValue = true;
    this.tooltipService.setSkipTooltipValue(true)
  }
  goToAciPaymentHubTooltip(){
    this.aciPaymentHubTooltip = true;
    this.dashboardModelDone = true;
  }
  skipAciPaymentHubTooltip(){
    this.aciPaymentHubTooltipDone = true;
  }

  goToCreateDocTooltip(){
    this.createDocTooltip = true;
    this.aciPaymentHubTooltipDone = true;
  }
  skipCreateDocTooltip(){
    this.createDocTooltipDone = true;
  }
  goToStartNewChatTooltip(){
    this.startNewChatTooltip = true;
    this.createDocTooltipDone = true;
  }
  doneWithTooltip(){
    this.startNewChatTooltipDone = true;
  }

  // Customize Widgets
  isCustomizeWidgets = false;
  customizeWidgets(){
    this.isCustomizeWidgets = true;
  }

  // Statistical Analysis Accordion Properties
  isStatisticalAnalysisExpanded = false;

  // Dashboard Customization Properties
  showDashboardCustomization = false;
  selectedWidgets = {
    topDx: true,
    secondDx: true,
    caregivers: true,
    strokeMortality: true
  };
  defaultWidgets = {
    topDx: true,
    secondDx: true,
    caregivers: true,
    strokeMortality: true
  };

  // Mini Chatbot Properties
  showMiniChatbot = false;
  miniChatMessages: Array<{text: string, isUser: boolean}> = [];
  miniChatInput = '';
  isTyping = false;
  isRecording = false;
  quickActions = [
    'Show trends',
    'Compare states',
    'Growth analysis',
    'Data insights'
  ];
  closeCustomizeWidgets(){
    this.isCustomizeWidgets = false;
  }

  dashboardStartNewChat(){
    this.router.navigate(['/dashboard-page/chat']);
  }
  toggleCustomizeWidgets(value: string) {
    const index = this.selectedCustomizeWidgets.indexOf(value);
    if (index === -1) {
      this.selectedCustomizeWidgets.push(value);
    } else {
      this.selectedCustomizeWidgets.splice(index, 1);
    }
  }

  saveCustomizeWidgets(){
    this.selectedWidgetList = this.selectedCustomizeWidgets
    this.isCustomizeWidgets = false;
  }
  restoreTodefault(){
    this.selectedWidgetList = this.onboardingService.getSelectedWidgetList();
    this.isCustomizeWidgets = false;
    this.selectedCustomizeWidgets = [];
  }

  // Statistical Analysis Accordion Methods
  toggleStatisticalAnalysis() {
    this.isStatisticalAnalysisExpanded = !this.isStatisticalAnalysisExpanded;
  }

  // Integration Data Handling
  handleIntegrationDataUpload(data: any) {
    console.log('Integration data uploaded:', data);
    
    // Add notification to mini chatbot
    this.addIntegrationNotification(data.file);
    
    // Update dashboard with new data insights
    this.updateDashboardWithIntegrationData(data.file);
  }

  handleFileDataForDashboard(data: any): void {
    console.log('Handling file data for dashboard:', data);
    
    // Store the received data for chart updates
    this.integrationData = data;
    
    // Update dashboard charts based on the file data received from integrations page
    switch (data.data.type) {
      case 'sales_data':
        console.log('Updating sales charts with:', data.data.chartData);
        this.updateSalesCharts(data.data);
        break;
      case 'team_performance':
        console.log('Updating team performance charts with:', data.data.chartData);
        this.updateTeamPerformanceCharts(data.data);
        break;
      case 'lead_metrics':
        console.log('Updating lead metrics charts with:', data.data.chartData);
        this.updateLeadMetricsCharts(data.data);
        break;
      case 'customer_satisfaction':
        console.log('Updating customer satisfaction charts with:', data.data.chartData);
        this.updateCustomerSatisfactionCharts(data.data);
        break;
      default:
        console.log('Generic file data received:', data.data);
    }
    
    // Add notification to mini chat
    this.addIntegrationNotification(data);
    
    // Show dashboard update notification
    this.showDashboardUpdateNotification(data.fileName);
  }

  addIntegrationNotification(file: any) {
    const notification = {
      text: `New file "${file.name}" has been uploaded and processed. You can now ask questions about this data.`,
      isUser: false,
      time: new Date().toLocaleTimeString()
    };
    
    this.miniChatMessages.unshift(notification);
  }

  updateDashboardWithIntegrationData(file: any) {
    // Update recent activity
    const newActivity = {
      action: 'File uploaded',
      file: file.name,
      time: 'Just now'
    };
    
    // Add to recent activity list (you can implement this based on your dashboard structure)
    console.log('Dashboard updated with new file:', file.name);
    
    // You can also update charts or other dashboard components here
    // For example, if it's a CSV file, you might want to update charts with new data
    if (file.type === 'CSV' && file.data) {
      this.updateChartsWithNewData(file.data);
    }
  }

  updateChartsWithNewData(data: any) {
    // Update chart data based on the uploaded file
    // This is a placeholder for chart updates
    console.log('Updating charts with new data:', data);
  }

  // Dashboard Customization Methods
  openDashboardCustomization() {
    console.log('Dashboard customization button clicked!');
    console.log('showDashboardCustomization before:', this.showDashboardCustomization);
    
    // Prevent double-clicking
    if (this.showDashboardCustomization) {
      return;
    }
    
    this.showDashboardCustomization = true;
    console.log('showDashboardCustomization after:', this.showDashboardCustomization);
    this.closeSidebarForChatbot(); // Reuse the same sidebar closing logic
  }

  closeDashboardCustomization() {
    this.showDashboardCustomization = false;
    this.reopenSidebarAfterChatbot(); // Reuse the same sidebar reopening logic
  }

  toggleWidget(widgetKey: keyof typeof this.selectedWidgets) {
    console.log('Toggling widget:', widgetKey);
    console.log('Before toggle:', this.selectedWidgets[widgetKey]);
    this.selectedWidgets[widgetKey] = !this.selectedWidgets[widgetKey];
    console.log('After toggle:', this.selectedWidgets[widgetKey]);
  }

  restoreToDefault() {
    // Restore to the default widget configuration
    this.selectedWidgets = { ...this.defaultWidgets };
    
    // Update the dashboard to reflect the default configuration
    this.updateDashboardWidgets();
    
    // Close the customization panel
    this.closeDashboardCustomization();
    
    // Show success message
    console.log('Dashboard restored to default configuration!');
  }

  saveCustomization() {
    // Save the current widget selection
    console.log('Saving widget customization:', this.selectedWidgets);
    
    // Update the dashboard to show only selected widgets
    this.updateDashboardWidgets();
    
    // Close the customization panel
    this.closeDashboardCustomization();
    
    // Show success message
    console.log('Widget customization saved successfully!');
  }

  updateDashboardWidgets() {
    // This method will be called to update the dashboard based on selected widgets
    // You can implement logic here to show/hide widgets based on selection
    console.log('Updating dashboard with selected widgets:', this.selectedWidgets);
    
    // Emit an event to notify other components about widget changes
    const event = new CustomEvent('dashboardWidgetsUpdated', {
      detail: { selectedWidgets: this.selectedWidgets }
    });
    window.dispatchEvent(event);
  }

  // Mini Chatbot Methods
  openMiniChatbot() {
    console.log('Mini chatbot button clicked!');
    console.log('showMiniChatbot before:', this.showMiniChatbot);
    this.showMiniChatbot = true;
    console.log('showMiniChatbot after:', this.showMiniChatbot);
    this.miniChatMessages = [];
    this.addWelcomeMessage();
    
    // Close sidebar to provide more space for the chatbot
    this.closeSidebarForChatbot();
  }

  closeSidebarForChatbot() {
    // Emit an event to close the sidebar
    // This will be handled by the parent component
    const event = new CustomEvent('closeSidebarForChatbot', {
      detail: { shouldClose: true }
    });
    window.dispatchEvent(event);
    
    // Also try to close sidebar directly if possible
    try {
      // Dispatch a custom event that the dashboard page can listen to
      window.dispatchEvent(new CustomEvent('dashboardSidebarToggle', {
        detail: { shouldClose: true }
      }));
    } catch (error) {
      console.log('Could not close sidebar directly:', error);
    }
  }

  closeMiniChatbot() {
    this.showMiniChatbot = false;
    this.miniChatInput = '';
    this.isTyping = false;
    
    // Reopen sidebar when chatbot is closed
    this.reopenSidebarAfterChatbot();
  }

  reopenSidebarAfterChatbot() {
    // Emit an event to reopen the sidebar
    const event = new CustomEvent('reopenSidebarAfterChatbot', {
      detail: { shouldOpen: true }
    });
    window.dispatchEvent(event);
    
    // Also try to reopen sidebar directly if possible
    try {
      // Dispatch a custom event that the dashboard page can listen to
      window.dispatchEvent(new CustomEvent('dashboardSidebarToggle', {
        detail: { shouldOpen: true }
      }));
    } catch (error) {
      console.log('Could not reopen sidebar directly:', error);
    }
  }

  addWelcomeMessage() {
    this.miniChatMessages.push({
      text: `Hello! I'm your Insites Assistant. I can help you analyze your ${this.selectedState} healthcare data. What would you like to know?`,
      isUser: false
    });
  }

  sendMiniChatMessage() {
    if (!this.miniChatInput.trim()) return;
    
    const userMessage = this.miniChatInput.trim();
    this.miniChatMessages.push({
      text: userMessage,
      isUser: true
    });
    
    this.miniChatInput = '';
    this.isTyping = true;
    
    // Simulate bot response
    setTimeout(() => {
      this.isTyping = false;
      const botResponse = this.generateBotResponse(userMessage);
      this.miniChatMessages.push({
        text: botResponse,
        isUser: false
      });
    }, 1500);
  }

  sendQuickAction(action: string) {
    this.miniChatInput = action;
    this.sendMiniChatMessage();
  }

  toggleMicrophone() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.isRecording = true;
    console.log('Starting voice recording...');
    
    // Add recording message to chat
    this.miniChatMessages.push({
      text: '🎤 Recording started... Please speak now',
      isUser: false
    });
    
    // Simulate voice recording
    setTimeout(() => {
      if (this.isRecording) {
        // Simulate voice input
        this.miniChatInput = 'Show me the latest trends in speech therapy data';
        this.stopRecording();
      }
    }, 3000);
  }

  stopRecording() {
    this.isRecording = false;
    console.log('Stopping voice recording...');
    
    // Add recording stopped message
    this.miniChatMessages.push({
      text: '✅ Recording stopped',
      isUser: false
    });
    
    // If there's voice input, send it
    if (this.miniChatInput.trim()) {
      this.sendMiniChatMessage();
    }
  }

  generateBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('trend') || message.includes('growth')) {
      const growthRate = this.getGrowthRate();
      return `Based on your ${this.selectedState} data, the current growth rate is ${growthRate}%. This shows a ${growthRate > 0 ? 'positive' : 'negative'} trend in healthcare demand.`;
    }
    
    if (message.includes('compare') || message.includes('state')) {
      return `I can help you compare ${this.selectedState} with other states. Currently, ${this.selectedState} shows ${this.getMarketShare()}% market share. Would you like to see comparisons with specific states?`;
    }
    
    if (message.includes('analysis') || message.includes('insight')) {
      const correlation = this.getCorrelationScore();
      return `Here's a key insight: Speech therapy and vision care show a correlation of ${correlation}, indicating strong integrated care opportunities in ${this.selectedState}.`;
    }
    
    if (message.includes('data') || message.includes('statistic')) {
      const confidence = this.getConfidenceLevel();
      return `Your data has a confidence level of ${confidence}%, which is very reliable. The standard deviation is ${this.getStandardDeviation()}, indicating ${this.getStandardDeviation() < 5 ? 'low' : 'moderate'} variability.`;
    }
    
    return `I understand you're asking about "${userMessage}". Let me analyze your ${this.selectedState} data and provide insights. What specific aspect would you like me to focus on?`;
  }

  // Statistical Analysis Methods
  getCurrentDateTime(): string {
    return new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getGrowthRate(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 2) return 0;
    
    const latest = currentData[currentData.length - 1];
    const previous = currentData[currentData.length - 2];
    const speechGrowth = ((latest.speech - previous.speech) / previous.speech) * 100;
    const visionGrowth = ((latest.vision - previous.vision) / previous.vision) * 100;
    
    return Math.round((speechGrowth + visionGrowth) / 2 * 10) / 10;
  }

  getMarketShare(): number {
    const stateData = (this.stateData as any)[this.selectedState];
    if (!stateData) return 0;
    
    const totalPatients = stateData.industryMetrics?.patients || 0;
    const nationalAverage = 15000; // Mock national average
    return Math.round((totalPatients / nationalAverage) * 100 * 10) / 10;
  }

  getCorrelationScore(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 2) return 0;
    
    const speechValues = currentData.map(d => d.speech);
    const visionValues = currentData.map(d => d.vision);
    
    const correlation = this.calculateCorrelation(speechValues, visionValues);
    return Math.round(correlation * 100) / 100;
  }

  getConfidenceLevel(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length === 0) return 0;
    
    // Calculate confidence based on data consistency and sample size
    const sampleSize = currentData.length;
    const variance = this.calculateVariance(currentData.map(d => d.speech));
    const confidence = Math.min(95, 85 + (sampleSize * 0.5) - (variance * 2));
    
    return Math.round(confidence);
  }

  getSpeechTrend(): string {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 3) return 'Stable';
    
    const recent = currentData.slice(-3);
    const trend = (recent[2].speech - recent[0].speech) / recent[0].speech * 100;
    
    if (trend > 5) return '+12.3%';
    if (trend > 0) return '+5.7%';
    if (trend > -5) return '-2.1%';
    return '-8.9%';
  }

  getVisionTrend(): string {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 3) return 'Stable';
    
    const recent = currentData.slice(-3);
    const trend = (recent[2].vision - recent[0].vision) / recent[0].vision * 100;
    
    if (trend > 5) return '+15.8%';
    if (trend > 0) return '+7.2%';
    if (trend > -5) return '-1.4%';
    return '-6.3%';
  }

  getSeasonalImpact(): string {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 4) return 'Low';
    
    // Calculate seasonal variation
    const q1Avg = currentData.filter((_, i) => i % 4 === 0).reduce((sum, d) => sum + d.speech, 0) / 3;
    const q2Avg = currentData.filter((_, i) => i % 4 === 1).reduce((sum, d) => sum + d.speech, 0) / 3;
    const q3Avg = currentData.filter((_, i) => i % 4 === 2).reduce((sum, d) => sum + d.speech, 0) / 3;
    const q4Avg = currentData.filter((_, i) => i % 4 === 3).reduce((sum, d) => sum + d.speech, 0) / 3;
    
    const maxVariation = Math.max(q1Avg, q2Avg, q3Avg, q4Avg) - Math.min(q1Avg, q2Avg, q3Avg, q4Avg);
    const avgValue = (q1Avg + q2Avg + q3Avg + q4Avg) / 4;
    const seasonalImpact = (maxVariation / avgValue) * 100;
    
    if (seasonalImpact > 15) return 'High';
    if (seasonalImpact > 8) return 'Medium';
    return 'Low';
  }

  getKeyInsight1(): string {
    return `Speech therapy demand shows strong correlation (${this.getCorrelationScore()}) with vision care trends, indicating integrated care opportunities.`;
  }

  getKeyInsight2(): string {
    const growthRate = this.getGrowthRate();
    return `Quarter-over-quarter growth rate of ${growthRate}% exceeds regional average, suggesting market expansion potential.`;
  }

  getKeyInsight3(): string {
    const confidence = this.getConfidenceLevel();
    return `Data confidence level of ${confidence}% indicates reliable forecasting, but recommend additional validation for Q4 projections.`;
  }

  getMeanGrowthRate(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length < 2) return 0;
    
    const growthRates = [];
    for (let i = 1; i < currentData.length; i++) {
      const speechGrowth = ((currentData[i].speech - currentData[i-1].speech) / currentData[i-1].speech) * 100;
      const visionGrowth = ((currentData[i].vision - currentData[i-1].vision) / currentData[i-1].vision) * 100;
      growthRates.push((speechGrowth + visionGrowth) / 2);
    }
    
    const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    return Math.round(mean * 10) / 10;
  }

  getPreviousMeanGrowth(): number {
    return Math.round((this.getMeanGrowthRate() - 2.3) * 10) / 10;
  }

  getGrowthChange(): number {
    return Math.round((this.getMeanGrowthRate() - this.getPreviousMeanGrowth()) * 10) / 10;
  }

  getStandardDeviation(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length === 0) return 0;
    
    const speechValues = currentData.map(d => d.speech);
    return Math.round(this.calculateStandardDeviation(speechValues) * 100) / 100;
  }

  getPreviousStdDev(): number {
    return Math.round((this.getStandardDeviation() + 0.15) * 100) / 100;
  }

  getStdDevChange(): string {
    const change = this.getStandardDeviation() - this.getPreviousStdDev();
    return change > 0 ? `+${Math.round(change * 100) / 100}` : `${Math.round(change * 100) / 100}`;
  }

  getCorrelationCoefficient(): number {
    return this.getCorrelationScore();
  }

  getPreviousCorrelation(): number {
    return Math.round((this.getCorrelationCoefficient() - 0.05) * 100) / 100;
  }

  getCorrelationChange(): number {
    return Math.round((this.getCorrelationCoefficient() - this.getPreviousCorrelation()) * 100) / 100;
  }

  getConfidenceInterval(): number {
    const currentData = this.chartDataService.getCurrentChartData();
    if (currentData.length === 0) return 0;
    
    const sampleSize = currentData.length;
    const standardError = this.getStandardDeviation() / Math.sqrt(sampleSize);
    const confidenceInterval = 1.96 * standardError; // 95% confidence level
    
    return Math.round(confidenceInterval * 10) / 10;
  }

  getPreviousConfidence(): number {
    return Math.round((this.getConfidenceInterval() + 1.2) * 10) / 10;
  }

  getConfidenceChange(): number {
    return Math.round((this.getPreviousConfidence() - this.getConfidenceInterval()) * 10) / 10;
  }

  // Helper methods for statistical calculations
  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
    
    return variance;
  }

  private calculateStandardDeviation(values: number[]): number {
    return Math.sqrt(this.calculateVariance(values));
  }

  // Notification Properties
  showNotificationPanel = false;
  notifications = [
    {
      id: 1,
      title: 'New Data Available',
      message: 'Updated healthcare data for North Carolina is now available',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      action: 'view_data'
    },
    {
      id: 2,
      title: 'Trend Alert',
      message: 'Significant increase in diabetes cases detected in Florida',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      action: 'view_trends'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Dashboard customization features have been enhanced',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      action: 'view_updates'
    }
  ];

  get unreadNotificationsCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Notification Methods
  toggleNotificationPanel() {
    this.showNotificationPanel = !this.showNotificationPanel;
    if (this.showNotificationPanel) {
      this.closeDashboardCustomization();
    }
  }

  closeNotificationPanel() {
    this.showNotificationPanel = false;
  }

  markNotificationAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.isRead = true);
  }

  deleteNotification(notificationId: number) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  handleNotificationAction(notification: any) {
    this.markNotificationAsRead(notification.id);
    
    switch (notification.action) {
      case 'view_data':
        // Navigate to data view or refresh current data
        console.log('Viewing new data for:', this.selectedState);
        break;
      case 'view_trends':
        // Navigate to trends analysis
        console.log('Viewing trend analysis');
        break;
      case 'view_updates':
        // Show system updates
        console.log('Viewing system updates');
        break;
      default:
        console.log('Notification action:', notification.action);
    }
    
    this.closeNotificationPanel();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'info': return 'text-[#1E40AF]';
      case 'warning': return 'text-[#F59E0B]';
      case 'success': return 'text-[#00A748]';
      case 'error': return 'text-[#DC2626]';
      default: return 'text-[#737780]';
    }
  }

  formatNotificationTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // Chart Update Methods for Integration Data
  updateSalesCharts(data: any): void {
    console.log('Updating sales charts with data:', data);
    // Update bar chart with sales data
    if (data.chartData) {
      // Convert integration data to chart format
      const chartDataPoints = data.chartData.labels.map((label: string, index: number) => ({
        name: label,
        speech: data.chartData.datasets[0].data[index],
        vision: 0 // Placeholder for second dataset if needed
      }));
      this.filteredChartData = chartDataPoints;
      this.chartDataService.updateChartData(chartDataPoints);
      
      // Force change detection by updating a visible property
      this.lastDataUpdate = new Date();
      console.log('Sales charts updated with new data:', chartDataPoints);
    }
    // Update metrics cards
    if (data.metrics) {
      console.log('Sales metrics updated:', data.metrics);
    }
  }

  updateTeamPerformanceCharts(data: any): void {
    console.log('Updating team performance charts with data:', data);
    // Update doughnut chart with team performance data
    if (data.chartData) {
      // Convert to doughnut chart format
      const chartDataPoints = data.chartData.labels.map((label: string, index: number) => ({
        name: label,
        speech: data.chartData.datasets[0].data[index],
        vision: 0
      }));
      this.filteredChartData = chartDataPoints;
      this.chartDataService.updateChartData(chartDataPoints);
    }
    // Update metrics
    if (data.metrics) {
      console.log('Team performance metrics updated:', data.metrics);
    }
  }

  updateLeadMetricsCharts(data: any): void {
    console.log('Updating lead metrics charts with data:', data);
    // Update stacked area chart with lead generation data
    if (data.chartData) {
      // Convert to stacked area chart format
      const chartDataPoints = data.chartData.labels.map((label: string, index: number) => ({
        name: label,
        speech: data.chartData.datasets[0].data[index],
        vision: 0
      }));
      this.filteredChartData = chartDataPoints;
      this.chartDataService.updateChartData(chartDataPoints);
    }
    // Update metrics
    if (data.metrics) {
      console.log('Lead metrics updated:', data.metrics);
    }
  }

  updateCustomerSatisfactionCharts(data: any): void {
    console.log('Updating customer satisfaction charts with data:', data);
    // Update charts with customer satisfaction data
    if (data.chartData) {
      // Convert to chart format
      const chartDataPoints = data.chartData.labels.map((label: string, index: number) => ({
        name: label,
        speech: data.chartData.datasets[0].data[index],
        vision: 0
      }));
      this.filteredChartData = chartDataPoints;
      this.chartDataService.updateChartData(chartDataPoints);
    }
    // Update metrics
    if (data.metrics) {
      console.log('Customer satisfaction metrics updated:', data.metrics);
    }
  }

  showDashboardUpdateNotification(fileName: string): void {
    // Create a visual notification that dashboard has been updated
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #00A748 !important;
      color: white !important;
      border-radius: 12px !important;
      padding: 24px 32px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      z-index: 999999 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      opacity: 1 !important;
      border: 3px solid white !important;
      min-width: 400px !important;
      text-align: center !important;
    `;
    
    notification.innerHTML = `
      <span style="font-size: 24px;">📊</span>
      <span>Dashboard Updated! Data from "${fileName}" has been loaded into charts.</span>
      <button style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 16px; cursor: pointer; padding: 8px 12px; border-radius: 6px; margin-left: 16px;" onclick="this.parentElement.remove()">OK</button>
    `;
    
    document.body.appendChild(notification);
    console.log('Dashboard update notification shown');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

}
