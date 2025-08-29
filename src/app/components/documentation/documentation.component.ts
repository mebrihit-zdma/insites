import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Folder {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  children?: Folder[];
  isOpen?: boolean;
  size?: string;
  modifiedDate?: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags?: string[];
  versions?: Array<{
    number: string;
    date: string;
    author: string;
  }>;
}

interface CreateDocumentForm {
  title: string;
  category: string;
  content: string;
  tags: string;
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent implements OnInit {
  
  folders: Folder[] = [
    {
      id: '1',
      name: 'Product Documentation',
      type: 'folder',
      icon: 'folder',
      isOpen: false,
      children: [
        {
          id: '1-1',
          name: 'Insites Platform User Guide',
          type: 'file',
          icon: 'description',
          size: '2.4 MB',
          modifiedDate: '2024-01-15'
        },
        {
          id: '1-2',
          name: 'API Integration Guide',
          type: 'file',
          icon: 'code',
          size: '1.8 MB',
          modifiedDate: '2024-01-12'
        },
        {
          id: '1-3',
          name: 'Dashboard Setup Guide',
          type: 'file',
          icon: 'description',
          size: '3.1 MB',
          modifiedDate: '2024-01-10'
        },
        {
          id: '1-4',
          name: 'Chat Assistant Manual',
          type: 'file',
          icon: 'chat',
          size: '1.2 MB',
          modifiedDate: '2024-01-08'
        }
      ]
    },
    {
      id: '2',
      name: 'Technical Specifications',
      type: 'folder',
      icon: 'folder',
      isOpen: false,
      children: [
        {
          id: '2-1',
          name: 'System Architecture Overview',
          type: 'file',
          icon: 'architecture',
          size: '4.2 MB',
          modifiedDate: '2024-01-08'
        },
        {
          id: '2-2',
          name: 'Database Schema Design',
          type: 'file',
          icon: 'storage',
          size: '1.5 MB',
          modifiedDate: '2024-01-05'
        },
        {
          id: '2-3',
          name: 'Security Implementation Guide',
          type: 'file',
          icon: 'security',
          size: '2.1 MB',
          modifiedDate: '2024-01-02'
        }
      ]
    },
    {
      id: '3',
      name: 'Business Reports',
      type: 'folder',
      icon: 'folder',
      isOpen: false,
      children: [
        {
          id: '3-1',
          name: 'Q4 2024 Performance Report',
          type: 'file',
          icon: 'description',
          size: '0.8 MB',
          modifiedDate: '2024-01-03'
        },
        {
          id: '3-2',
          name: 'Market Analysis Report',
          type: 'file',
          icon: 'description',
          size: '0.9 MB',
          modifiedDate: '2023-12-28'
        },
        {
          id: '3-3',
          name: 'Customer Satisfaction Survey',
          type: 'file',
          icon: 'assessment',
          size: '1.1 MB',
          modifiedDate: '2023-12-20'
        }
      ]
    },
    {
      id: '4',
      name: 'Development Guidelines',
      type: 'folder',
      icon: 'folder',
      isOpen: false,
      children: [
        {
          id: '4-1',
          name: 'Coding Standards',
          type: 'file',
          icon: 'code',
          size: '0.6 MB',
          modifiedDate: '2024-01-01'
        },
        {
          id: '4-2',
          name: 'Testing Procedures',
          type: 'file',
          icon: 'bug_report',
          size: '0.7 MB',
          modifiedDate: '2023-12-15'
        }
      ]
    },
    {
      id: '5',
      name: 'Marketing Materials',
      type: 'folder',
      icon: 'folder',
      isOpen: false,
      children: [
        {
          id: '5-1',
          name: 'Product Brochure',
          type: 'file',
          icon: 'picture_as_pdf',
          size: '3.5 MB',
          modifiedDate: '2024-01-05'
        },
        {
          id: '5-2',
          name: 'Sales Presentation',
          type: 'file',
          icon: 'slideshow',
          size: '2.8 MB',
          modifiedDate: '2023-12-30'
        }
      ]
    }
  ];

  selectedDocument: Document | null = null;
  searchTerm: string = '';
  currentPath: string[] = ['Documents'];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Sample documents data
  documents: Document[] = [
    {
      id: '1-1',
      title: 'Insites Platform User Guide',
      content: `
# Insites Platform User Guide

## Overview
The Insites Platform is a comprehensive business intelligence and analytics solution designed to help organizations make data-driven decisions.

## Getting Started
1. **Login**: Access the platform using your credentials
2. **Dashboard**: View key metrics and insights
3. **Navigation**: Use the sidebar to access different modules

## Key Features
- **Real-time Analytics**: Monitor performance in real-time
- **Custom Dashboards**: Create personalized views
- **Data Integration**: Connect multiple data sources
- **AI Assistant**: Get insights through natural language queries

## Best Practices
- Regularly update your dashboard configurations
- Use the search functionality to find specific data
- Export reports for external sharing
- Set up alerts for important metrics

For more information, contact our support team.
      `,
      lastModified: '2024-01-15',
      author: 'John Smith',
      status: 'published',
      category: 'Product Documentation',
      tags: ['user guide', 'getting started', 'platform', 'analytics']
    },
    {
      id: '1-2',
      title: 'API Integration Guide',
      content: `
# API Integration Guide

## Introduction
This guide provides comprehensive information about integrating with the Insites Platform API.

## Authentication
All API requests require authentication using API keys or OAuth 2.0.

## Endpoints
- **GET /api/dashboard**: Retrieve dashboard data
- **POST /api/analytics**: Submit analytics data
- **PUT /api/config**: Update configuration settings

## Rate Limits
- 1000 requests per hour for standard accounts
- 5000 requests per hour for premium accounts

## Error Handling
Implement proper error handling for all API calls.
      `,
      lastModified: '2024-01-12',
      author: 'Sarah Johnson',
      status: 'published',
      category: 'Product Documentation',
      tags: ['api', 'integration', 'authentication', 'endpoints']
    },
    {
      id: '3-1',
      title: 'Q4 2024 Performance Report',
      content: `
# Q4 2024 Performance Report

## Executive Summary
Q4 2024 showed strong performance across all key metrics with significant growth in user engagement and revenue.

## Key Metrics
- **Revenue Growth**: 25% increase compared to Q3
- **User Engagement**: 40% improvement in daily active users
- **Customer Satisfaction**: 4.8/5 rating
- **Platform Uptime**: 99.9% availability

## Highlights
- Launched new AI-powered features
- Expanded to 3 new markets
- Improved customer support response time
- Enhanced security measures

## Outlook
Positive momentum expected to continue into Q1 2025.
      `,
      lastModified: '2024-01-03',
      author: 'Michael Chen',
      status: 'published',
      category: 'Business Reports',
      tags: ['performance', 'Q4', 'revenue', 'growth', 'metrics']
    }
  ];
  showCreateModal: boolean = false;
  showImportModal: boolean = false;
  showEditModal: boolean = false;
  showShareModal: boolean = false;
  showInfoModal: boolean = false;
  showMenuModal: boolean = false;

  // Form data
  createForm: CreateDocumentForm = {
    title: '',
    category: 'Product Documentation',
    content: '',
    tags: ''
  };

  editForm: CreateDocumentForm = {
    title: '',
    category: 'Product Documentation',
    content: '',
    tags: ''
  };

  // Share modal data
  shareLink: string = '';
  shareEmail: string = '';
  sharePermissions: 'view' | 'edit' | 'admin' = 'view';
  isPublic: boolean = false;

  // Import modal data
  importFile: File | null = null;
  importCategory: string = 'Product Documentation';

  // Categories for dropdowns
  categories = [
    'Product Documentation',
    'Technical Specifications',
    'Business Reports',
    'User Guides',
    'API Documentation',
    'Release Notes'
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate loading documents
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleFolder(folder: Folder): void {
    if (folder.type === 'folder') {
      folder.isOpen = !folder.isOpen;
    } else {
      this.openDocument(folder);
    }
  }

  openDocument(file: Folder): void {
    this.isLoading = true;
    
    // Check if we have a sample document for this file
    const sampleDoc = this.documents.find(doc => doc.id === file.id);
    
    setTimeout(() => {
      if (sampleDoc) {
        this.selectedDocument = {
          ...sampleDoc,
          versions: [
            { number: 'v1.2', date: '2024-01-15', author: sampleDoc.author },
            { number: 'v1.1', date: '2024-01-10', author: 'Jane Smith' },
            { number: 'v1.0', date: '2024-01-05', author: sampleDoc.author }
          ]
        };
      } else {
        this.selectedDocument = {
          id: file.id,
          title: file.name,
          content: this.generateDocumentContent(file.name),
          lastModified: file.modifiedDate || new Date().toLocaleDateString(),
          author: 'John Doe',
          status: 'published',
          category: this.getCategoryFromFolder(file),
          tags: this.generateTags(file.name),
          versions: [
            { number: 'v1.2', date: '2024-01-15', author: 'John Doe' },
            { number: 'v1.1', date: '2024-01-10', author: 'Jane Smith' },
            { number: 'v1.0', date: '2024-01-05', author: 'John Doe' }
          ]
        };
      }
      this.isLoading = false;
    }, 500);
  }

  generateDocumentContent(title: string): string {
    const contentMap: { [key: string]: string } = {
      'User Guide': `
        <h2>User Guide</h2>
        <p>Welcome to our comprehensive user guide. This document will help you understand how to use our platform effectively.</p>
        
        <h3>Getting Started</h3>
        <p>To begin using our platform, follow these simple steps:</p>
        <ol>
          <li>Create an account or sign in to your existing account</li>
          <li>Complete your profile setup</li>
          <li>Explore the dashboard and familiarize yourself with the interface</li>
          <li>Start creating your first project</li>
        </ol>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Dashboard Analytics:</strong> Get real-time insights into your data</li>
          <li><strong>Document Management:</strong> Organize and manage all your documents</li>
          <li><strong>Collaboration Tools:</strong> Work together with your team seamlessly</li>
          <li><strong>Advanced Search:</strong> Find what you need quickly and efficiently</li>
        </ul>
        
        <h3>Best Practices</h3>
        <p>For the best experience, we recommend:</p>
        <ul>
          <li>Regularly updating your profile information</li>
          <li>Using descriptive names for your projects</li>
          <li>Organizing documents into logical folders</li>
          <li>Taking advantage of the collaboration features</li>
        </ul>
      `,
      'API Reference': `
        <h2>API Reference</h2>
        <p>This document provides comprehensive information about our REST API endpoints and how to use them.</p>
        
        <h3>Authentication</h3>
        <p>All API requests require authentication using Bearer tokens:</p>
        <pre><code>Authorization: Bearer YOUR_API_TOKEN</code></pre>
        
        <h3>Base URL</h3>
        <p>All API endpoints are relative to:</p>
        <pre><code>https://api.example.com/v1</code></pre>
        
        <h3>Endpoints</h3>
        
        <h4>GET /documents</h4>
        <p>Retrieve a list of documents.</p>
        <pre><code>GET /documents?page=1&limit=10</code></pre>
        
        <h4>POST /documents</h4>
        <p>Create a new document.</p>
        <pre><code>POST /documents
{
  "title": "New Document",
  "content": "Document content",
  "category": "Product Documentation"
}</code></pre>
        
        <h4>PUT /documents/{id}</h4>
        <p>Update an existing document.</p>
        
        <h4>DELETE /documents/{id}</h4>
        <p>Delete a document.</p>
      `,
      'Installation Guide': `
        <h2>Installation Guide</h2>
        <p>Follow this guide to install and configure our platform on your system.</p>
        
        <h3>System Requirements</h3>
        <ul>
          <li>Node.js 16.0 or higher</li>
          <li>npm 8.0 or higher</li>
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>Minimum 4GB RAM</li>
          <li>2GB available disk space</li>
        </ul>
        
        <h3>Installation Steps</h3>
        
        <h4>Step 1: Clone the Repository</h4>
        <pre><code>git clone https://github.com/example/platform.git
cd platform</code></pre>
        
        <h4>Step 2: Install Dependencies</h4>
        <pre><code>npm install</code></pre>
        
        <h4>Step 3: Configure Environment</h4>
        <pre><code>cp .env.example .env
# Edit .env with your configuration</code></pre>
        
        <h4>Step 4: Run the Application</h4>
        <pre><code>npm start</code></pre>
        
        <h3>Configuration</h3>
        <p>Update the following environment variables in your .env file:</p>
        <ul>
          <li><code>DATABASE_URL</code>: Your database connection string</li>
          <li><code>API_KEY</code>: Your API key for external services</li>
          <li><code>PORT</code>: Port number (default: 3000)</li>
        </ul>
      `,
      'System Architecture': `
        <h2>System Architecture</h2>
        <p>This document outlines the high-level architecture of our platform.</p>
        
        <h3>Overview</h3>
        <p>Our platform follows a microservices architecture pattern with the following components:</p>
        
        <h3>Frontend Layer</h3>
        <ul>
          <li><strong>React/Angular Application:</strong> Modern web interface</li>
          <li><strong>Static Assets:</strong> Images, CSS, JavaScript files</li>
          <li><strong>CDN:</strong> Content delivery network for global performance</li>
        </ul>
        
        <h3>API Layer</h3>
        <ul>
          <li><strong>REST API:</strong> Main application programming interface</li>
          <li><strong>GraphQL:</strong> Alternative query interface</li>
          <li><strong>Authentication Service:</strong> User authentication and authorization</li>
        </ul>
        
        <h3>Business Logic Layer</h3>
        <ul>
          <li><strong>Document Service:</strong> Document management and processing</li>
          <li><strong>User Service:</strong> User management and profiles</li>
          <li><strong>Analytics Service:</strong> Data analysis and reporting</li>
        </ul>
        
        <h3>Data Layer</h3>
        <ul>
          <li><strong>Primary Database:</strong> PostgreSQL for structured data</li>
          <li><strong>Document Store:</strong> MongoDB for document storage</li>
          <li><strong>Cache:</strong> Redis for session and data caching</li>
        </ul>
      `,
      'Database Schema': `
        <h2>Database Schema</h2>
        <p>This document describes the database schema and relationships.</p>
        
        <h3>Users Table</h3>
        <pre><code>CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);</code></pre>
        
        <h3>Documents Table</h3>
        <pre><code>CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id),
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);</code></pre>
        
        <h3>Document Versions Table</h3>
        <pre><code>CREATE TABLE document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  version_number VARCHAR(20),
  content TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);</code></pre>
        
        <h3>Tags Table</h3>
        <pre><code>CREATE TABLE tags (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);</code></pre>
      `,
      'Q4 Performance Report': `
        <h2>Q4 Performance Report</h2>
        <p>This report provides a comprehensive overview of our performance metrics for Q4 2024.</p>
        
        <h3>Executive Summary</h3>
        <p>Q4 2024 showed strong performance across all key metrics, with significant improvements in user engagement and revenue growth.</p>
        
        <h3>Key Metrics</h3>
        <table>
          <tr>
            <th>Metric</th>
            <th>Q3 2024</th>
            <th>Q4 2024</th>
            <th>Change</th>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$2.1M</td>
            <td>$2.4M</td>
            <td>+14.3%</td>
          </tr>
          <tr>
            <td>Active Users</td>
            <td>11,847</td>
            <td>12,847</td>
            <td>+8.4%</td>
          </tr>
          <tr>
            <td>Customer Satisfaction</td>
            <td>92.1%</td>
            <td>94.2%</td>
            <td>+2.1%</td>
          </tr>
        </table>
        
        <h3>Performance Highlights</h3>
        <ul>
          <li>Revenue growth exceeded targets by 3.2%</li>
          <li>User retention improved by 15%</li>
          <li>New feature adoption rate reached 78%</li>
          <li>Customer support response time reduced by 40%</li>
        </ul>
      `,
      'Market Analysis': `
        <h2>Market Analysis</h2>
        <p>Comprehensive analysis of market trends and competitive landscape.</p>
        
        <h3>Market Overview</h3>
        <p>The document management market continues to grow rapidly, driven by increasing digital transformation initiatives and remote work trends.</p>
        
        <h3>Market Size</h3>
        <ul>
          <li>Global market size: $5.2 billion (2024)</li>
          <li>Expected CAGR: 12.8% (2024-2029)</li>
          <li>North America: 42% market share</li>
          <li>Europe: 28% market share</li>
          <li>Asia Pacific: 20% market share</li>
        </ul>
        
        <h3>Key Trends</h3>
        <ul>
          <li>Cloud-based solutions gaining traction</li>
          <li>AI and machine learning integration</li>
          <li>Mobile-first approach</li>
          <li>Enhanced security and compliance features</li>
        </ul>
        
        <h3>Competitive Analysis</h3>
        <p>Our main competitors include:</p>
        <ul>
          <li><strong>Competitor A:</strong> 25% market share, strong enterprise focus</li>
          <li><strong>Competitor B:</strong> 18% market share, innovative features</li>
          <li><strong>Competitor C:</strong> 15% market share, competitive pricing</li>
        </ul>
      `
    };

    return contentMap[title] || `
      <h2>${title}</h2>
      <p>This is the content of ${title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Feature 1: Description of the first key feature</li>
        <li>Feature 2: Description of the second key feature</li>
        <li>Feature 3: Description of the third key feature</li>
      </ul>
      <h3>Benefits</h3>
      <p>This document provides valuable insights and information that will help users understand and utilize the system effectively.</p>
    `;
  }

  getCategoryFromFolder(file: Folder): string {
    // Find the parent folder and return its name
    for (const folder of this.folders) {
      if (folder.children?.some(child => child.id === file.id)) {
        return folder.name;
      }
    }
    return 'Product Documentation';
  }

  generateTags(title: string): string[] {
    const tagMap: { [key: string]: string[] } = {
      'User Guide': ['documentation', 'guide', 'user', 'tutorial'],
      'API Reference': ['api', 'reference', 'technical', 'developer'],
      'Installation Guide': ['installation', 'setup', 'configuration', 'technical'],
      'System Architecture': ['architecture', 'technical', 'system', 'design'],
      'Database Schema': ['database', 'schema', 'technical', 'data'],
      'Q4 Performance Report': ['report', 'performance', 'quarterly', 'business'],
      'Market Analysis': ['analysis', 'market', 'business', 'research']
    };

    return tagMap[title] || ['documentation', 'guide', 'reference'];
  }

  getFilteredFolders(): Folder[] {
    if (!this.searchTerm) {
      return this.folders;
    }
    
    return this.folders.filter(folder => 
      folder.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      folder.children?.some(child => 
        child.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  getBreadcrumbPath(): string {
    return this.currentPath.join(' > ');
  }

  getBreadcrumbPathArray(): string[] {
    return this.currentPath;
  }

  getTotalDocumentCount(): number {
    let count = 0;
    this.folders.forEach(folder => {
      if (folder.children) {
        count += folder.children.length;
      }
    });
    return count;
  }

  getFileMeta(folder: Folder): string {
    if (folder.type === 'file') {
      const parts = [];
      if (folder.size) parts.push(folder.size);
      if (folder.modifiedDate) parts.push(folder.modifiedDate);
      return parts.join(' • ');
    }
    return '';
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  // Create Document Functionality
  createNewDocument(): void {
    this.showCreateModal = true;
    this.resetCreateForm();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetCreateForm();
  }

  resetCreateForm(): void {
    this.createForm = {
      title: '',
      category: 'Product Documentation',
      content: '',
      tags: ''
    };
  }

  submitCreateForm(): void {
    if (!this.createForm.title.trim()) {
      this.showNotification('Please enter a document title', 'error');
      return;
    }

    // Create new document
    const newDocument: Document = {
      id: Date.now().toString(),
      title: this.createForm.title,
      content: this.createForm.content || '<h2>' + this.createForm.title + '</h2><p>New document content will be added here.</p>',
      lastModified: new Date().toLocaleDateString(),
      author: 'Current User',
      status: 'draft',
      category: this.createForm.category,
      tags: this.createForm.tags ? this.createForm.tags.split(',').map(tag => tag.trim()) : []
    };

    // Add to folders (simulate adding to the first folder)
    if (this.folders.length > 0) {
      const firstFolder = this.folders[0];
      if (!firstFolder.children) {
        firstFolder.children = [];
      }
      
      firstFolder.children.unshift({
        id: newDocument.id,
        name: newDocument.title,
        type: 'file',
        icon: 'description',
        size: '0 KB',
        modifiedDate: newDocument.lastModified
      });
    }

    this.selectedDocument = newDocument;
    this.closeCreateModal();
    this.showNotification('Document created successfully!', 'success');
  }

  // Edit Document Functionality
  editDocument(): void {
    if (!this.selectedDocument) return;
    
    this.editForm = {
      title: this.selectedDocument.title,
      category: this.selectedDocument.category,
      content: this.selectedDocument.content,
      tags: this.selectedDocument.tags?.join(', ') || ''
    };
    
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  submitEditForm(): void {
    if (!this.selectedDocument || !this.editForm.title.trim()) {
      this.showNotification('Please enter a document title', 'error');
      return;
    }

    // Update document
    this.selectedDocument.title = this.editForm.title;
    this.selectedDocument.content = this.editForm.content;
    this.selectedDocument.category = this.editForm.category;
    this.selectedDocument.tags = this.editForm.tags ? this.editForm.tags.split(',').map(tag => tag.trim()) : [];
    this.selectedDocument.lastModified = new Date().toLocaleDateString();

    // Update in folders
    this.updateDocumentInFolders(this.selectedDocument);

    this.closeEditModal();
    this.showNotification('Document updated successfully!', 'success');
  }

  updateDocumentInFolders(document: Document): void {
    for (const folder of this.folders) {
      if (folder.children) {
        const fileIndex = folder.children.findIndex(child => child.id === document.id);
        if (fileIndex !== -1) {
          folder.children[fileIndex].name = document.title;
          folder.children[fileIndex].modifiedDate = document.lastModified;
          break;
        }
      }
    }
  }

  // Share Document Functionality
  shareDocument(): void {
    if (!this.selectedDocument) return;
    
    this.shareLink = `https://example.com/documents/${this.selectedDocument.id}`;
    this.shareEmail = '';
    this.sharePermissions = 'view';
    this.isPublic = false;
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  copyShareLink(): void {
    navigator.clipboard.writeText(this.shareLink).then(() => {
      this.showNotification('Share link copied to clipboard!', 'success');
    }).catch(() => {
      this.showNotification('Failed to copy link', 'error');
    });
  }

  sendShareEmail(): void {
    if (!this.shareEmail.trim()) {
      this.showNotification('Please enter an email address', 'error');
      return;
    }

    // Simulate sending email
    setTimeout(() => {
      this.showNotification(`Document shared with ${this.shareEmail}`, 'success');
      this.shareEmail = '';
    }, 1000);
  }

  // Download Document Functionality
  downloadDocument(): void {
    if (!this.selectedDocument) return;
    
    // Create downloadable content
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.selectedDocument.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1, h2, h3 { color: #333; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        ${this.selectedDocument.content}
        <hr>
        <p><strong>Author:</strong> ${this.selectedDocument.author}</p>
        <p><strong>Last Modified:</strong> ${this.selectedDocument.lastModified}</p>
        <p><strong>Category:</strong> ${this.selectedDocument.category}</p>
        ${this.selectedDocument.tags ? `<p><strong>Tags:</strong> ${this.selectedDocument.tags.join(', ')}</p>` : ''}
      </body>
      </html>
    `;

    // Create and download file
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.selectedDocument.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.showNotification('Document downloaded successfully!', 'success');
  }

  // Document Info Functionality
  showDocumentInfo(): void {
    if (!this.selectedDocument) return;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  // Document Menu Functionality
  showDocumentMenu(): void {
    this.showMenuModal = true;
  }

  closeMenuModal(): void {
    this.showMenuModal = false;
  }

  // Import Document Functionality
  importDocument(): void {
    this.showImportModal = true;
    this.importFile = null;
    this.importCategory = 'Product Documentation';
  }

  closeImportModal(): void {
    this.showImportModal = false;
    this.importFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importFile = file;
    }
  }

  submitImportForm(): void {
    if (!this.importFile) {
      this.showNotification('Please select a file to import', 'error');
      return;
    }

    // Simulate import process
    this.isLoading = true;
    setTimeout(() => {
      // Create new document from imported file
      const newDocument: Document = {
        id: Date.now().toString(),
        title: this.importFile?.name?.replace(/\.[^/.]+$/, '') || 'Imported Document',
        content: `<h2>${this.importFile?.name || 'Imported Document'}</h2><p>Imported document content from ${this.importFile?.name || 'unknown file'}</p>`,
        lastModified: new Date().toLocaleDateString(),
        author: 'Current User',
        status: 'draft',
        category: this.importCategory,
        tags: ['imported', 'document']
      };

      // Add to folders
      if (this.folders.length > 0) {
        const firstFolder = this.folders[0];
        if (!firstFolder.children) {
          firstFolder.children = [];
        }
        
        firstFolder.children.unshift({
          id: newDocument.id,
          name: newDocument.title,
          type: 'file',
          icon: 'description',
          size: this.formatFileSize(this.importFile?.size || 0),
          modifiedDate: newDocument.lastModified
        });
      }

      this.selectedDocument = newDocument;
      this.closeImportModal();
      this.isLoading = false;
      this.showNotification('Document imported successfully!', 'success');
    }, 2000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Document status management
  updateDocumentStatus(status: 'draft' | 'published' | 'archived'): void {
    if (this.selectedDocument) {
      this.selectedDocument.status = status;
      this.showNotification(`Document status updated to: ${status}`, 'success');
    }
  }

  // Enhanced search functionality
  onSearchInput(event: any): void {
    this.searchTerm = event.target.value;
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchTerm) {
      console.log('Performing search for:', this.searchTerm);
    }
  }

  refreshDocuments(): void {
    this.loadDocuments();
    this.showNotification('Documents refreshed!', 'success');
  }

  // Error handling
  handleError(error: any): void {
    this.errorMessage = error.message || 'An error occurred while loading documents.';
    console.error('Document error:', error);
  }

  // Notification system
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      max-width: 300px;
      word-wrap: break-word;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    `;

    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  }
}
