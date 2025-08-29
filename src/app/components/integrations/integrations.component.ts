import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBgColor: string;
  status: 'connected' | 'disconnected' | 'connecting';
  modalTitle: string;
  modalDescription: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: Date;
  source: string;
  status: 'processed' | 'processing' | 'error';
  data?: any;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations.component.html',
  styleUrl: './integrations.component.css'
})
export class IntegrationsComponent implements OnInit {
  
  integrations: Integration[] = [
    {
      id: 'jira',
      name: 'JIRA',
      description: 'Connect your JIRA instance to sync work items and issues',
      icon: 'bug_report',
      iconBgColor: '#deebff',
      status: 'disconnected',
      modalTitle: 'Integrate JIRA',
      modalDescription: 'Set up your JIRA integration to automatically sync work items.'
    },
    {
      id: 'customer-files',
      name: 'Customer Files',
      description: 'Upload and manage custom files and documents',
      icon: 'folder',
      iconBgColor: '#f0f0f0',
      status: 'disconnected',
      modalTitle: 'Custom Files',
      modalDescription: 'Upload custom sources'
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Connect to SharePoint to extract files, pages, or metadata',
      icon: 'cloud',
      iconBgColor: '#bce4e6',
      status: 'disconnected',
      modalTitle: 'Integrate SharePoint',
      modalDescription: 'SharePoint will extract files, pages, or metadata'
    },
    {
      id: 'confluence',
      name: 'Confluence',
      description: 'Sync your Confluence pages and documentation',
      icon: 'article',
      iconBgColor: '#e3f2fd',
      status: 'disconnected',
      modalTitle: 'Integrate Confluence',
      modalDescription: 'Connect your Confluence instance to sync pages and documentation.'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Integrate with Slack for notifications and collaboration',
      icon: 'chat',
      iconBgColor: '#f3e5f5',
      status: 'disconnected',
      modalTitle: 'Integrate Slack',
      modalDescription: 'Connect Slack for notifications and team collaboration.'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect to GitHub repositories for code documentation',
      icon: 'code',
      iconBgColor: '#f5f5f5',
      status: 'disconnected',
      modalTitle: 'Integrate GitHub',
      modalDescription: 'Connect your GitHub repositories to sync code documentation.'
    }
  ];

  selectedIntegration: Integration | null = null;
  showModal = false;
  modalStep = 1; // 1: Connect, 2: Configuration, 3: Success
  
  // File upload properties
  uploadedFiles: UploadedFile[] = [];
  selectedFiles: File[] = [];
  isUploading = false;
  uploadProgress = 0;

  // File viewing and filtering properties
  viewMode: 'grid' | 'list' = 'grid';
  statusFilter: string = '';
  typeFilter: string = '';
  sortBy: string = 'uploadDate';
  searchQuery: string = '';
  filteredFiles: UploadedFile[] = [];

  // Mock data for dashboard integration
  mockDashboardData = {
    customerInsights: [
      { category: 'Healthcare', value: 45, trend: 'up' },
      { category: 'Finance', value: 32, trend: 'down' },
      { category: 'Technology', value: 28, trend: 'up' },
      { category: 'Retail', value: 19, trend: 'stable' }
    ],
    performanceMetrics: [
      { metric: 'Response Time', value: '2.3s', status: 'good' },
      { metric: 'Accuracy', value: '94.2%', status: 'excellent' },
      { metric: 'Uptime', value: '99.8%', status: 'excellent' },
      { metric: 'User Satisfaction', value: '4.7/5', status: 'good' }
    ],
    recentActivity: [
      { action: 'File uploaded', file: 'customer_data_2024.csv', time: '2 hours ago' },
      { action: 'Analysis completed', file: 'market_trends.pdf', time: '4 hours ago' },
      { action: 'Report generated', file: 'quarterly_insights.docx', time: '1 day ago' }
    ]
  };

  ngOnInit(): void {
    // Initialize with mock uploaded files
    this.initializeMockFiles();
    // Apply initial filters
    this.applyFilters();
    console.log('ngOnInit - uploadedFiles:', this.uploadedFiles);
    console.log('ngOnInit - filteredFiles:', this.filteredFiles);
  }





  initializeMockFiles(): void {
    this.uploadedFiles = [
      {
        id: '1',
        name: 'Q4_2024_Sales_Data.csv',
        size: '4.2 MB',
        type: 'CSV',
        uploadDate: new Date('2024-01-15'),
        source: 'Sales Team',
        status: 'processed',
        data: {
          records: 25420,
          columns: ['sales_id', 'customer_name', 'product_category', 'sales_amount', 'region', 'sales_rep', 'date'],
          insights: 'Q4 2024 sales performance across all regions and product categories'
        }
      },
      {
        id: '2',
        name: 'Customer_Feedback_Survey_2024.xlsx',
        size: '2.8 MB',
        type: 'XLSX',
        uploadDate: new Date('2024-01-14'),
        source: 'Marketing Team',
        status: 'processed',
        data: {
          sheets: 5,
          rows: 8500,
          insights: 'Customer satisfaction scores and feedback analysis for product improvement'
        }
      },
      {
        id: '3',
        name: 'Regional_Performance_Report.pdf',
        size: '3.5 MB',
        type: 'PDF',
        uploadDate: new Date('2024-01-13'),
        source: 'Sales Team',
        status: 'processed',
        data: {
          pages: 32,
          topics: ['Regional Sales Analysis', 'Performance Metrics', 'Growth Opportunities'],
          insights: 'Comprehensive regional performance analysis with actionable insights'
        }
      },
      {
        id: '4',
        name: 'Product_Inventory_Status.xlsx',
        size: '1.9 MB',
        type: 'XLSX',
        uploadDate: new Date('2024-01-12'),
        source: 'Operations Team',
        status: 'processed',
        data: {
          sheets: 3,
          rows: 4200,
          insights: 'Current inventory levels, stock status, and reorder recommendations'
        }
      },
      {
        id: '5',
        name: 'Sales_Team_Performance.csv',
        size: '1.2 MB',
        type: 'CSV',
        uploadDate: new Date('2024-01-11'),
        source: 'HR Team',
        status: 'processed',
        data: {
          records: 850,
          columns: ['rep_id', 'rep_name', 'region', 'sales_target', 'actual_sales', 'achievement_rate'],
          insights: 'Individual sales representative performance and target achievement rates'
        }
      },
      {
        id: '6',
        name: 'Customer_Churn_Analysis.docx',
        size: '2.1 MB',
        type: 'DOCX',
        uploadDate: new Date('2024-01-10'),
        source: 'Analytics Team',
        status: 'processed',
        data: {
          sections: 6,
          charts: 8,
          insights: 'Customer churn patterns, risk factors, and retention strategies'
        }
      },
      {
        id: '7',
        name: 'Marketing_Campaign_Results.xlsx',
        size: '3.8 MB',
        type: 'XLSX',
        uploadDate: new Date('2024-01-09'),
        source: 'Marketing Team',
        status: 'processed',
        data: {
          sheets: 7,
          rows: 12500,
          insights: 'Marketing campaign performance metrics, ROI analysis, and conversion rates'
        }
      },
      {
        id: '8',
        name: 'Competitive_Analysis_Report.pdf',
        size: '5.2 MB',
        type: 'PDF',
        uploadDate: new Date('2024-01-08'),
        source: 'Strategy Team',
        status: 'processed',
        data: {
          pages: 45,
          topics: ['Competitor Analysis', 'Market Positioning', 'Strategic Recommendations'],
          insights: 'Comprehensive competitive landscape analysis and strategic positioning'
        }
      },
      {
        id: '9',
        name: 'Lead_Generation_Metrics.csv',
        size: '2.7 MB',
        type: 'CSV',
        uploadDate: new Date('2024-01-07'),
        source: 'Sales Team',
        status: 'processed',
        data: {
          records: 18500,
          columns: ['lead_id', 'source', 'status', 'value', 'conversion_date', 'sales_rep'],
          insights: 'Lead generation performance, conversion rates, and pipeline analysis'
        }
      },
      {
        id: '10',
        name: 'Product_Launch_Feedback.xlsx',
        size: '1.5 MB',
        type: 'XLSX',
        uploadDate: new Date('2024-01-06'),
        source: 'Product Team',
        status: 'processed',
        data: {
          sheets: 4,
          rows: 3200,
          insights: 'New product launch feedback, user adoption rates, and feature requests'
        }
      }
    ];
  }

  openIntegrationModal(integration: Integration): void {
    this.selectedIntegration = integration;
    this.showModal = true;
    this.modalStep = 1;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedIntegration = null;
    this.modalStep = 1;
    this.selectedFiles = [];
    this.isUploading = false;
    this.uploadProgress = 0;
  }

  connectIntegration(): void {
    if (this.selectedIntegration?.id === 'customer-files') {
      this.modalStep = 2; // Show file upload step
    } else {
      this.modalStep = 2; // Show connecting step
      this.simulateConnection();
    }
  }

  simulateConnection(): void {
    setTimeout(() => {
      this.modalStep = 3; // Show success step
      if (this.selectedIntegration) {
        this.selectedIntegration.status = 'connected';
      }
    }, 2000);
  }

  // File upload methods
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate file upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.processUploadedFiles();
      }
    }, 200);
  }

  processUploadedFiles(): void {
    this.selectedFiles.forEach((file, index) => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + index,
        name: file.name,
        size: this.formatFileSize(file.size),
        type: this.getFileType(file.name),
        uploadDate: new Date(),
        source: 'Customer Files',
        status: 'processing'
      };

      // Add to list immediately with processing status
      this.uploadedFiles.unshift(uploadedFile);

      // Simulate detailed processing steps
      this.simulateFileProcessing(uploadedFile, file, index);
    });

    this.isUploading = false;
    this.uploadProgress = 0;
    this.selectedFiles = [];
    this.modalStep = 3; // Show success
  }

  simulateFileProcessing(file: UploadedFile, originalFile: File, index: number): void {
    const processingSteps = [
      { name: 'Validating file format', duration: 500 },
      { name: 'Extracting content', duration: 800 },
      { name: 'Analyzing data structure', duration: 600 },
      { name: 'Generating insights', duration: 700 },
      { name: 'Indexing for search', duration: 400 },
      { name: 'Preparing for dashboard', duration: 300 }
    ];

    let currentStep = 0;
    const totalSteps = processingSteps.length;

    const processStep = () => {
      if (currentStep < totalSteps) {
        const step = processingSteps[currentStep];
        
        // Update processing status
        file.data = {
          ...file.data,
          currentStep: step.name,
          progress: Math.round(((currentStep + 1) / totalSteps) * 100)
        };

        currentStep++;
        
        setTimeout(processStep, step.duration);
      } else {
        // Processing complete
        file.status = 'processed';
        file.data = {
          ...this.generateMockData(originalFile.name),
          processingComplete: true,
          processedAt: new Date().toISOString()
        };
        
        // Send data to dashboard
        this.sendToDashboard(file);
        
        // Show success notification
        this.showNotification(`${file.name} processed successfully!`, 'success');
      }
    };

    // Start processing
    setTimeout(processStep, 500 + (index * 200));
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toUpperCase();
    return extension || 'Unknown';
  }

  generateMockData(filename: string): any {
    const fileTypes = {
      'csv': {
        records: Math.floor(Math.random() * 10000) + 1000,
        columns: ['id', 'name', 'value', 'category', 'date'],
        insights: 'Structured data with customer information and metrics'
      },
      'pdf': {
        pages: Math.floor(Math.random() * 50) + 10,
        topics: ['Analysis', 'Report', 'Documentation'],
        insights: 'Document containing detailed analysis and insights'
      },
      'docx': {
        sections: Math.floor(Math.random() * 10) + 5,
        charts: Math.floor(Math.random() * 20) + 5,
        insights: 'Comprehensive document with charts and analysis'
      },
      'xlsx': {
        sheets: Math.floor(Math.random() * 5) + 1,
        rows: Math.floor(Math.random() * 1000) + 100,
        insights: 'Spreadsheet with financial or operational data'
      }
    };

    const extension = filename.split('.').pop()?.toLowerCase();
    return fileTypes[extension as keyof typeof fileTypes] || {
      insights: 'File uploaded successfully'
    };
  }

  sendToDashboard(file: UploadedFile): void {
    // Create a custom event to send data to dashboard
    const dashboardEvent = new CustomEvent('integrationDataUploaded', {
      detail: {
        file: file,
        timestamp: new Date(),
        source: 'integrations'
      }
    });
    window.dispatchEvent(dashboardEvent);
  }

  deleteFile(fileId: string): void {
    console.log('deleteFile called with fileId:', fileId);
    // Show custom confirmation dialog
    this.showDeleteConfirmation(fileId);
  }

  showDeleteConfirmation(fileId: string): void {
    const file = this.uploadedFiles.find(f => f.id === fileId);
    if (!file) {
      console.error('File not found:', fileId);
      return;
    }

    console.log('Showing delete confirmation for file:', file.name);

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay delete-confirmation-overlay';
    modalOverlay.style.zIndex = '2500';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'delete-confirmation-modal';
    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="warning-icon">
          <span class="material-icons">warning</span>
        </div>
        <h3>Delete File</h3>
      </div>
      <div class="modal-body">
        <p class="confirmation-message">
          Are you sure you want to delete <strong>"${file.name}"</strong>?
        </p>
        <p class="warning-message">
          This action cannot be undone. The file and all its associated data will be permanently removed.
        </p>
        <div class="file-info-preview">
          <div class="file-preview-item">
            <span class="material-icons">${this.getFileIcon(file.type)}</span>
            <div class="file-details">
              <span class="file-name">${file.name}</span>
              <span class="file-meta">${file.size} • ${file.type} • Uploaded ${file.uploadDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" type="button">
          Cancel
        </button>
        <button class="btn-delete" type="button" data-file-id="${fileId}">
          <span class="material-icons">delete</span>
          Delete File
        </button>
      </div>
    `;
    
    // Append modal content to overlay
    modalOverlay.appendChild(modalContent);
    
    // Handle backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.closeDeleteModal(modalOverlay);
      }
    });
    
    // Handle button clicks
    const cancelBtn = modalContent.querySelector('.btn-cancel') as HTMLButtonElement;
    const deleteBtn = modalContent.querySelector('.btn-delete') as HTMLButtonElement;
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        console.log('Cancel clicked');
        this.closeDeleteModal(modalOverlay);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        console.log('Delete clicked for file:', fileId);
        this.confirmDeleteFile(fileId);
        this.closeDeleteModal(modalOverlay);
      });
    }
    
    // Add to page
    document.body.appendChild(modalOverlay);
    
    // Focus on cancel button for accessibility
    setTimeout(() => {
      cancelBtn?.focus();
    }, 100);
    
    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeDeleteModal(modalOverlay);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Store the event listener for cleanup
    (modalOverlay as any).keydownListener = handleKeyDown;
  }

  private closeDeleteModal(modalOverlay: HTMLElement): void {
    const keydownListener = (modalOverlay as any).keydownListener;
    if (keydownListener) {
      document.removeEventListener('keydown', keydownListener);
    }
    modalOverlay.remove();
  }

  confirmDeleteFile(fileId: string): void {
    const file = this.uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    // Remove from list
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    
    // Update filtered files
    this.applyFilters();
    
    // Show success message
    this.showNotification(`"${file.name}" has been deleted successfully`, 'success');
    
    // Update dashboard if needed
    this.updateDashboardAfterDelete(fileId);
  }

  downloadFile(file: UploadedFile): void {
    try {
      // Create a blob with mock data for demonstration
      let content = '';
      let filename = file.name;
      
      switch (file.type.toLowerCase()) {
        case 'csv':
          content = this.generateCSVContent(file);
          break;
        case 'pdf':
          content = this.generatePDFContent(file);
          break;
        case 'docx':
          content = this.generateDOCXContent(file);
          break;
        case 'xlsx':
          content = this.generateXLSXContent(file);
          break;
        default:
          content = `File: ${file.name}\nSize: ${file.size}\nType: ${file.type}\nUpload Date: ${file.uploadDate}`;
      }
      
      // Create blob and download
      const blob = new Blob([content], { type: this.getMimeType(file.type) });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      this.showNotification('File downloaded successfully', 'success');
    } catch (error) {
      console.error('Download error:', error);
      this.showNotification('Download failed. Please try again.', 'error');
    }
  }

  viewFileDetails(file: UploadedFile): void {
    console.log('viewFileDetails called with file:', file);
    
    try {
      // Open file details modal
      this.openFileDetailsModal(file);
    } catch (error) {
      console.error('Error opening file details modal:', error);
      alert('Error opening modal: ' + error);
    }
  }

  openFileDetailsModal(file: UploadedFile): void {
    console.log('Opening file details modal for:', file.name);

    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 13, 18, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05), 0 4px 20px rgba(0, 0, 0, 0.1);
      font-family: 'Inter', sans-serif;
      border: 1px solid #D0D1D4;
    `;
    
          content.innerHTML = `
        <div style="padding: 24px; border-bottom: 1px solid #D0D1D4; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #22252B; font-family: 'Inter', sans-serif;">File Details</h3>
          <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #737780; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease;">×</button>
        </div>
      
              <div style="padding: 24px;">
          <div style="margin-bottom: 16px;">
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Name:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif;">${file.name}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Size:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif;">${file.size}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Type:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif;">${file.type}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Upload Date:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif;">${file.uploadDate.toLocaleDateString()} ${file.uploadDate.toLocaleTimeString()}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Source:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif;">${file.source}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Status:</strong>
              <span style="padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; font-family: 'Inter', sans-serif; background: ${file.status === 'processed' ? '#F8FFF9' : '#FFF8E1'}; color: ${file.status === 'processed' ? '#00A748' : '#FFB020'}; border: 1px solid ${file.status === 'processed' ? '#E7FFC9' : '#FFE4B3'};">
                ${this.getFileStatusText(file.status)}
              </span>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #737780; display: inline-block; width: 100px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">File ID:</strong>
              <span style="color: #22252B; font-size: 14px; font-family: 'Inter', sans-serif; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;">${file.id}</span>
            </div>
            ${file.data ? `
            <div style="margin-top: 20px; padding: 16px; background: #F8F9FA; border-radius: 8px; border-left: 4px solid #00A748;">
              <strong style="color: #00A748; display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;">📊 File Insights:</strong>
              <div style="font-size: 14px; color: #737780; font-family: 'Inter', sans-serif; line-height: 1.4;">
                ${this.formatFileInsights(file.data)}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      
      <div style="padding: 24px; border-top: 1px solid #D0D1D4; display: flex; gap: 12px; justify-content: flex-end;">
        <button id="closeBtn" style="padding: 12px 20px; border: 1px solid #D0D1D4; background: white; color: #737780; border-radius: 8px; cursor: pointer; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s ease; min-width: 80px;">Close</button>
        <button id="sendToDashboardBtn" style="padding: 12px 20px; border: none; background: #00A748; color: white; border-radius: 8px; cursor: pointer; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s ease; min-width: 140px;">Send to Dashboard</button>
        <button id="downloadBtn" style="padding: 12px 20px; border: 1px solid #D0D1D4; background: white; color: #737780; border-radius: 8px; cursor: pointer; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s ease; min-width: 100px;">Download</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    console.log('Simple modal created and added to DOM');
    
    // Add event listeners with proper cleanup
    const closeModal = () => {
      modal.remove();
    };
    
    const closeBtn = content.querySelector('#closeBtn') as HTMLButtonElement;
    const closeModalBtn = content.querySelector('#closeModalBtn') as HTMLButtonElement;
    const sendToDashboardBtn = content.querySelector('#sendToDashboardBtn') as HTMLButtonElement;
    const downloadBtn = content.querySelector('#downloadBtn') as HTMLButtonElement;
    
    // Close button events
    closeBtn?.addEventListener('click', closeModal);
    closeModalBtn?.addEventListener('click', closeModal);
    
    // Backdrop click to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Send to Dashboard button
    sendToDashboardBtn?.addEventListener('click', () => {
      console.log('Send to Dashboard clicked for file:', file.name);
      this.sendFileDataToDashboard(file);
      this.showNotification(`Data from "${file.name}" sent to dashboard!`, 'success');
      closeModal();
    });
    
    // Download button
    downloadBtn?.addEventListener('click', () => {
      console.log('Download clicked for file:', file.name);
      this.downloadFile(file);
      closeModal();
    });
    
    // Keyboard support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up keyboard listener when modal closes
    const originalCloseModal = closeModal;
    (modal as any).closeModal = () => {
      document.removeEventListener('keydown', handleKeyDown);
      originalCloseModal();
    };
  }

  private closeFileDetailsModal(modalOverlay: HTMLElement): void {
    const keydownListener = (modalOverlay as any).keydownListener;
    if (keydownListener) {
      document.removeEventListener('keydown', keydownListener);
    }
    modalOverlay.remove();
  }

  generateFilePreview(file: UploadedFile): string {
    switch (file.type.toLowerCase()) {
      case 'csv':
        return `
          <div class="csv-preview">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Value</th><th>Category</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Sample Data 1</td><td>100</td><td>Category A</td></tr>
                <tr><td>2</td><td>Sample Data 2</td><td>200</td><td>Category B</td></tr>
                <tr><td>3</td><td>Sample Data 3</td><td>150</td><td>Category A</td></tr>
              </tbody>
            </table>
          </div>
        `;
      case 'pdf':
        return `
          <div class="pdf-preview">
            <div class="pdf-page">
              <h3>Document Title</h3>
              <p>This is a preview of the PDF document content. The actual document contains detailed information and analysis.</p>
              <p>Page 1 of ${file.data?.pages || 'Unknown'} pages</p>
            </div>
          </div>
        `;
      case 'docx':
        return `
          <div class="docx-preview">
            <h3>Document Content</h3>
            <p>This is a preview of the Word document. The document contains ${file.data?.sections || 'multiple'} sections with detailed information.</p>
            <p>Charts and graphs: ${file.data?.charts || '0'}</p>
          </div>
        `;
      default:
        return `
          <div class="file-preview-generic">
            <p>Preview not available for this file type.</p>
            <p>File: ${file.name}</p>
            <p>Size: ${file.size}</p>
          </div>
        `;
    }
  }

  formatFileInsights(data: any): string {
    if (!data) return '<p>No insights available</p>';
    
    let insights = '<ul>';
    for (const [key, value] of Object.entries(data)) {
      insights += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    insights += '</ul>';
    
    return insights;
  }

  generateCSVContent(file: UploadedFile): string {
    return `ID,Name,Value,Category,Date
1,Sample Data 1,100,Category A,2024-01-15
2,Sample Data 2,200,Category B,2024-01-15
3,Sample Data 3,150,Category A,2024-01-15
4,Sample Data 4,300,Category C,2024-01-15
5,Sample Data 5,250,Category B,2024-01-15`;
  }

  generatePDFContent(file: UploadedFile): string {
    return `PDF Document Content
Title: ${file.name}
Generated: ${new Date().toISOString()}

This is a sample PDF content for demonstration purposes.
The actual file would contain the real document content.`;
  }

  generateDOCXContent(file: UploadedFile): string {
    return `Word Document Content
Title: ${file.name}
Sections: ${file.data?.sections || 'Unknown'}
Charts: ${file.data?.charts || '0'}

This is a sample Word document content for demonstration purposes.
The actual file would contain the real document content.`;
  }

  generateXLSXContent(file: UploadedFile): string {
    return `Excel Spreadsheet Content
Sheet: ${file.name}
Rows: ${file.data?.rows || 'Unknown'}
Sheets: ${file.data?.sheets || '1'}

This is a sample Excel content for demonstration purposes.
The actual file would contain the real spreadsheet data.`;
  }

  getMimeType(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'csv':
        return 'text/csv';
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'text/plain';
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    console.log('showNotification called with:', message, type);
    
    // Create notification element with inline styles to force visibility
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 24px !important;
      right: 24px !important;
      background: white !important;
      border-radius: 12px !important;
      padding: 16px 20px !important;
      box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05), 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      z-index: 99999 !important;
      max-width: 400px !important;
      border: 1px solid #D0D1D4 !important;
      font-family: 'Inter', sans-serif !important;
      pointer-events: auto !important;
      visibility: visible !important;
      opacity: 1 !important;
      color: #22252B !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.4 !important;
    `;
    
    // Add border color based on type
    if (type === 'success') {
      notification.style.borderLeft = '4px solid #00A748 !important';
    } else if (type === 'error') {
      notification.style.borderLeft = '4px solid #C33025 !important';
    } else {
      notification.style.borderLeft = '4px solid #2726DD !important';
    }
    
    notification.innerHTML = `
      <span style="flex: 1; color: #22252B; font-family: 'Inter', sans-serif; font-weight: 500; line-height: 1.4;">${message}</span>
      <button style="background: none; border: none; font-size: 18px; cursor: pointer; color: #737780; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.2s;" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    console.log('Notification element added to DOM with inline styles');
    console.log('Notification element:', notification);
    console.log('Notification computed styles:', window.getComputedStyle(notification));
    
    // Auto remove after 5 seconds (longer for testing)
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
        console.log('Notification removed');
      }
    }, 5000);
  }



  updateDashboardAfterDelete(fileId: string): void {
    // Notify dashboard about file deletion
    const event = new CustomEvent('integrationFileDeleted', {
      detail: { fileId: fileId }
    });
    window.dispatchEvent(event);
  }

  // Method to send file data to dashboard for chart integration
  sendFileDataToDashboard(file: UploadedFile): void {
    console.log('sendFileDataToDashboard called for file:', file.name);
    
    const dashboardData = this.generateDashboardDataFromFile(file);
    console.log('Generated dashboard data:', dashboardData);
    
    const dashboardEvent = new CustomEvent('fileDataForDashboard', {
      detail: {
        fileId: file.id,
        fileName: file.name,
        data: dashboardData,
        timestamp: new Date()
      }
    });
    window.dispatchEvent(dashboardEvent);
    console.log('Dashboard event dispatched');
  }

  // Generate dashboard-compatible data from uploaded files
  generateDashboardDataFromFile(file: UploadedFile): any {
    switch (file.name.toLowerCase()) {
      case 'q4_2024_sales_data.csv':
        return {
          type: 'sales_data',
          chartData: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
              label: 'Sales Revenue',
              data: [1250000, 1380000, 1420000, 1580000],
              backgroundColor: 'rgba(0, 167, 72, 0.2)',
              borderColor: 'rgba(0, 167, 72, 1)',
              borderWidth: 2
            }]
          },
          metrics: {
            totalSales: 5630000,
            growthRate: 12.5,
            topRegion: 'North America',
            topProduct: 'Enterprise Solutions'
          }
        };

      case 'sales_team_performance.csv':
        return {
          type: 'team_performance',
          chartData: {
            labels: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'Alex Brown'],
            datasets: [{
              label: 'Achievement Rate (%)',
              data: [95, 87, 92, 89, 94],
              backgroundColor: [
                'rgba(0, 167, 72, 0.8)',
                'rgba(255, 176, 32, 0.8)',
                'rgba(0, 167, 72, 0.8)',
                'rgba(255, 176, 32, 0.8)',
                'rgba(0, 167, 72, 0.8)'
              ]
            }]
          },
          metrics: {
            averageAchievement: 91.4,
            topPerformer: 'John Smith',
            teamSize: 5
          }
        };

      case 'lead_generation_metrics.csv':
        return {
          type: 'lead_metrics',
          chartData: {
            labels: ['Website', 'Social Media', 'Email Campaign', 'Referrals', 'Events'],
            datasets: [{
              label: 'Leads Generated',
              data: [450, 320, 280, 180, 220],
              backgroundColor: [
                'rgba(0, 167, 72, 0.8)',
                'rgba(30, 64, 175, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(255, 176, 32, 0.8)',
                'rgba(108, 117, 125, 0.8)'
              ]
            }]
          },
          metrics: {
            totalLeads: 1450,
            conversionRate: 23.5,
            topSource: 'Website'
          }
        };

      case 'customer_feedback_survey_2024.xlsx':
        return {
          type: 'customer_satisfaction',
          chartData: {
            labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
            datasets: [{
              label: 'Customer Responses',
              data: [45, 35, 12, 6, 2],
              backgroundColor: [
                'rgba(0, 167, 72, 0.8)',
                'rgba(30, 64, 175, 0.8)',
                'rgba(255, 176, 32, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(108, 117, 125, 0.8)'
              ]
            }]
          },
          metrics: {
            satisfactionScore: 4.2,
            totalResponses: 100,
            netPromoterScore: 78
          }
        };

      default:
        return {
          type: 'generic_data',
          message: `Data from ${file.name} is available for dashboard integration`,
          fileType: file.type,
          recordCount: file.data?.records || file.data?.rows || 'Unknown'
        };
    }
  }

  // File viewing and filtering methods
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getProcessedCount(): number {
    return this.uploadedFiles.filter(file => file.status === 'processed').length;
  }

  getProcessingCount(): number {
    return this.uploadedFiles.filter(file => file.status === 'processing').length;
  }

  applyFilters(): void {
    let filtered = [...this.uploadedFiles];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.type.toLowerCase().includes(query) ||
        file.source.toLowerCase().includes(query) ||
        (file.data?.insights && file.data.insights.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(file => file.status === this.statusFilter);
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(file => file.type === this.typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return this.parseFileSize(b.size) - this.parseFileSize(a.size);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'uploadDate':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

    this.filteredFiles = filtered;
  }

  onSearchInput(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.typeFilter = '';
    this.sortBy = 'uploadDate';
    this.searchQuery = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.statusFilter !== '' || this.typeFilter !== '' || this.sortBy !== 'uploadDate' || this.searchQuery.trim() !== '';
  }

  parseFileSize(size: string): number {
    const match = size.match(/^([\d.]+)\s*([KMGT]?B)$/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    const multipliers: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    };
    
    return value * (multipliers[unit] || 1);
  }

  getStatusClass(integration: Integration): string {
    switch (integration.status) {
      case 'connected':
        return 'status-connected';
      case 'connecting':
        return 'status-connecting';
      default:
        return 'status-disconnected';
    }
  }

  getStatusText(integration: Integration): string {
    switch (integration.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Connect';
    }
  }

  getFileIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'csv':
        return 'table_chart';
      case 'pdf':
        return 'picture_as_pdf';
      case 'docx':
        return 'description';
      case 'xlsx':
        return 'table_view';
      default:
        return 'insert_drive_file';
    }
  }

  getFileStatusText(fileStatus: string): string {
    switch (fileStatus) {
      case 'processed':
        return 'Processed';
      case 'processing':
        return 'Processing';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  }

  getModalStepTitle(): string {
    if (this.selectedIntegration?.id === 'customer-files') {
      switch (this.modalStep) {
        case 1:
          return 'Upload Custom Files';
        case 2:
          return 'Processing Files';
        case 3:
          return 'Upload Complete';
        default:
          return 'Custom Files';
      }
    }
    
    switch (this.modalStep) {
      case 1:
        return this.selectedIntegration?.modalTitle || 'Connect Integration';
      case 2:
        return 'Connecting...';
      case 3:
        return 'Connection Successful';
      default:
        return 'Integration';
    }
  }

  getModalStepDescription(): string {
    if (this.selectedIntegration?.id === 'customer-files') {
      switch (this.modalStep) {
        case 1:
          return 'Select files to upload and process for dashboard insights';
        case 2:
          return 'Processing your files and extracting insights...';
        case 3:
          return 'Files have been successfully uploaded and processed';
        default:
          return 'Upload custom sources';
      }
    }
    
    switch (this.modalStep) {
      case 1:
        return this.selectedIntegration?.modalDescription || 'Set up your integration';
      case 2:
        return 'Establishing connection to the service...';
      case 3:
        return 'Your integration has been successfully connected';
      default:
        return 'Integration setup';
    }
  }
}
