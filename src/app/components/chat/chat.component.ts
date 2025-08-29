import { Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SearchChatService } from '../../services/search-chat.service';
import { LoginService } from '../../services/login.service';

import { AnswerSource, ChatMessage, ResponseMessage, ResponseSource, ChatHistory, followUpQuestions } from '../../models/chat.model';
import { extractAnswerText, extractfollowUpQuestions, convertMarkdown, extractSources, extractResponseSources } from '../../utils/chat-utils';
import { UserService } from '../../services/user.service';
import { StreamService } from '../../services/stream.service';

@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  currentDate: Date = new Date();
  app_id = "67daf330d62c5ade928150d1";
  model_name ="azure/gpt-4o";
  top_k = 3;

  userName: string | null = 'User Name';
  userId: any = "8c8cda2b-cda6-41c2-927d-511d40724810-test-chat-v2";
  sessionId: any = "";
  profileImageUrl: string | null = null;
  searchValue: string = '';
  loginDisplay: boolean = false;

  askedQuestion: string = '';
  sources: AnswerSource[] = [];
  messages: ChatMessage[] = [];
  chatMessages: ResponseMessage[] = [];

  // Enhanced Chat Features
  showSettingsModal = false;
  showFileUploadModal = false;
  showVoiceModal = false;
  showExportModal = false;
  showShareModal = false;
  
  // Chat Settings
  chatTheme = 'light';
  messageSound = true;
  autoScroll = true;
  autoSave = true;
  typingSpeed = 'normal';
  aiPersonality = 'professional';
  
  // Voice Features
  isRecording = false;
  isListening = false;
  voiceRecognition: any;
  audioContext: any;
  mediaRecorder: any;
  audioChunks: any[] = [];
  
  // File Handling
  selectedFiles: File[] = [];
  supportedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx', '.png', '.jpg', '.jpeg'];
  maxFileSize = 10 * 1024 * 1024; // 10MB
  
  // AI Features
  isTyping = false;
  isGenerating = false;
  aiThinking = false;
  showSuggestions = true;
  autoComplete = true;
  
  // Chat History & Export
  chatHistory: any[] = [];
  exportFormats = ['PDF', 'DOCX', 'TXT', 'JSON'];
  selectedExportFormat = 'PDF';
  
  // Sharing & Collaboration
  shareLink = '';
  isPublic = false;
  collaborators: string[] = [];
  
  // Advanced Features
  showCodeHighlighting = true;
  showMathRendering = true;
  showImageGeneration = false;
  showDataVisualization = true;
  
  // Chat features
  createShortcutPrompt = false;
  isAddShortcutPrompt = false;
  createdPrompt: string = "";
  isDeletePrompt = false;
  selectedPrompt: any = null;
  createdLibraryPrompt: string = "";
  promptsLibrarySearch: string = "";
  
  showAlert = false;
  alertMessage = '';
  alertType = 'success';

  // Prompts
  promptShortcuts: any[] = [
    { source: "Dashboard Insights", question: "What are the key insights from the latest customer data?" },
    { source: "Performance Analysis", question: "How can I improve customer satisfaction scores?" },
    { source: "Market Trends", question: "What trends are emerging in our market analysis?" },
    { source: "Quarterly Review", question: "Can you analyze the performance metrics for this quarter?" },
    { source: "Healthcare Analytics", question: "Show me the ischemic stroke mortality trends by state" },
    { source: "Customer Needs", question: "What are the predicted customer needs for next quarter?" },
    { source: "Industry Performance", question: "Compare our performance against industry benchmarks" },
    { source: "Data Integration", question: "What insights can we get from the uploaded customer files?" },
    { source: "AI Analysis", question: "Generate a comprehensive report on our business performance" },
    { source: "Predictive Analytics", question: "What are the future trends we should prepare for?" }
  ];

  promptsLibrarylist = [
    { prompt: "Generate an API customization guide for ACI Payment Hub" },
    { prompt: "What are the differences between the latest and older release notes?" },
    { prompt: "Explain updates from the latest Release Notes" },
    { prompt: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments" },
    { prompt: "Analyze customer satisfaction trends from the last quarter" },
    { prompt: "Create a performance comparison report for different regions" },
    { prompt: "Generate insights from healthcare data analysis" },
    { prompt: "What are the key metrics for measuring business success?" },
    { prompt: "Create a step-by-step guide for data integration" },
    { prompt: "Analyze market trends and provide recommendations" }
  ];

  @ViewChild('promptInput') promptInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private apiService: ApiService, 
    private chatService: ChatService, 
    private onboardingService: OnboardingService,
    private userService: UserService,
    private searchChatService: SearchChatService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private streamService: StreamService
  ) {}

  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    
    this.userService.userImageUrl$.subscribe(imageUrl => {
      this.profileImageUrl = imageUrl;
    });
    
    this.searchChatService.searchValue$.subscribe((value: string) => {
      this.searchValue = value; 
    });

    this.loginDisplay= this.loginService.getLoginDisplay();
    
    // Don't initialize chat history by default - show clean interface
    // this.initializeDashboardChatHistory();
  }

  // Voice Recognition methods
  initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.voiceRecognition = new (window as any).webkitSpeechRecognition();
      this.voiceRecognition.continuous = false;
      this.voiceRecognition.interimResults = false;
      this.voiceRecognition.lang = 'en-US';
    }
  }

  initializeAudioContext() {
    if ('AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  startVoiceInput() {
    if (this.voiceRecognition) {
      this.isListening = true;
      this.voiceRecognition.start();
      
      this.voiceRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.askedQuestion = transcript;
        this.isListening = false;
      };
      
      this.voiceRecognition.onerror = () => {
        this.isListening = false;
      };
    }
  }

  // File Upload methods
  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const validFiles: File[] = [];
    
    files.forEach((file: File) => {
      if (file.size > this.maxFileSize) {
        this.alertMessage = `File ${file.name} is too large. Maximum size is 10MB.`;
        this.showAlert = true;
        return;
      }
      
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (this.supportedFileTypes.includes(extension)) {
        validFiles.push(file);
      } else {
        this.alertMessage = `File type ${extension} is not supported.`;
        this.showAlert = true;
      }
    });
    
    if (validFiles.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
      const fileNames = validFiles.map(f => f.name).join(', ');
      this.alertMessage = `Files uploaded: ${fileNames}`;
      this.showAlert = true;
    }
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Message Handling methods
  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.askQuestion(this.askedQuestion);
    }
  }

  onInputChange() {
    this.isTyping = this.askedQuestion.length > 0;
  }

  // AI Features methods
  askQuestion(question: string) {
    if (!question.trim() || this.isGenerating) return;
    
    const userMessage: ResponseMessage = {
      sender: 'user',
      text: question,
      timestamp: new Date()
    };
    
    this.chatMessages.push(userMessage);
    this.askedQuestion = '';
    this.isGenerating = true;
    
    // Simulate AI response
    setTimeout(() => {
      const botMessage: ResponseMessage = {
        sender: 'bot',
        text: `I understand you're asking about "${question}". Let me help you with that.`,
        timestamp: new Date()
      };
      this.chatMessages.push(botMessage);
      this.isGenerating = false;
    }, 2000);
  }

  // Message Actions methods
  copyMessage(text: string) {
    navigator.clipboard.writeText(text);
    this.showToast('Message copied to clipboard');
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.showToast('Code copied to clipboard');
  }

  editMessage(index: number) {
    const message = this.chatMessages[index];
    if (message.sender === 'user') {
      this.askedQuestion = message.text;
      this.chatMessages.splice(index, 1);
    }
  }

  likeMessage(index: number) {
    this.chatMessages[index].liked = !this.chatMessages[index].liked;
    this.chatMessages[index].disliked = false;
  }

  dislikeMessage(index: number) {
    this.chatMessages[index].disliked = !this.chatMessages[index].disliked;
    this.chatMessages[index].liked = false;
  }

  regenerateResponse(index: number) {
    const message = this.chatMessages[index];
    if (message.sender === 'bot') {
      this.askQuestion(this.chatMessages[index - 1]?.text || '');
    }
  }

  // Chat History & Export methods
  saveChatHistory() {
    if (this.autoSave) {
      localStorage.setItem('chatHistory', JSON.stringify(this.chatMessages));
    }
  }

  exportChat(format: string) {
    const content = this.chatMessages.map(msg => 
      `${msg.sender}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export.${format.toLowerCase()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Sharing & Collaboration methods
  generateShareLink() {
    const chatData = btoa(JSON.stringify(this.chatMessages));
    this.shareLink = `${window.location.origin}/chat?data=${chatData}`;
  }

  addCollaborator(email: string) {
    if (email && !this.collaborators.includes(email)) {
      this.collaborators.push(email);
    }
  }

  removeCollaborator(email: string) {
    this.collaborators = this.collaborators.filter(e => e !== email);
  }

  // Integration Data Handling
  handleIntegrationDataUpload(data: any) {
    const notification: ResponseMessage = {
      sender: 'bot',
      text: `New file "${data.file.name}" has been uploaded and processed. You can now ask questions about this data.`,
      timestamp: new Date()
    };
    this.chatMessages.unshift(notification);
  }

  // Utility Functions
  showToast(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // Modal Management
  openSettings() {
    this.showSettingsModal = true;
  }

  closeSettings() {
    this.showSettingsModal = false;
  }

  openExportModal() {
    this.generateShareLink();
    this.showExportModal = true;
  }

  closeExportModal() {
    this.showExportModal = false;
  }

  openShareModal() {
    this.generateShareLink();
    this.showShareModal = true;
  }

  closeShareModal() {
    this.showShareModal = false;
  }

  clearChat() {
    this.chatMessages = [];
    this.selectedFiles = [];
  }

  // Prompts Library
  openPromptsLibraryModel() {
    this.createShortcutPrompt = true;
  }

  closePromptsLibraryModel() {
    this.createShortcutPrompt = false;
  }

  addPromptToLibrary() {
    if (this.createdLibraryPrompt.trim()) {
      this.promptsLibrarylist.push({ prompt: this.createdLibraryPrompt });
      this.createdLibraryPrompt = '';
      // Show success notification
      this.showNotification('Prompt added successfully!', 'success');
      // Close the modal after adding
      this.closePromptsLibraryModel();
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    // Create notification element
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

    // Set background color based on type
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
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

  deleteLibraryPrompt(itemToDelete: { prompt: string }) {
    this.promptsLibrarylist = this.promptsLibrarylist.filter(item => item !== itemToDelete);
  }

  getFilteredPrompts() {
    if (!this.promptsLibrarySearch) {
      return this.promptsLibrarylist;
    }
    return this.promptsLibrarylist.filter(item =>
      item.prompt.toLowerCase().includes(this.promptsLibrarySearch.toLowerCase())
    );
  }

  getHighlightedText(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Shortcuts
  addShortcutPrompt() {
    this.createShortcutPrompt = true;
  }

  showDeletePrompt(prompt: any) {
    this.selectedPrompt = prompt;
  }

  deletePrompt(prompt: any) {
    this.promptShortcuts = this.promptShortcuts.filter(p => p !== prompt);
    this.selectedPrompt = null;
  }

  handleFollowUp(question: string) {
    this.askQuestion(question);
  }

  getShortcutsPrompt() {
    return this.promptShortcuts;
  }

  onDocumentClick() {
    this.createShortcutPrompt = false;
  }

  // Add other methods as needed...
  initializeDashboardChatHistory() {
    // Clear existing chat history
    this.chatMessages = [];

    // Add sample chat history based on dashboard sidebar widgets
    const sampleHistory: ResponseMessage[] = [
      {
        sender: 'user',
        text: 'Show me the latest dashboard insights and metrics',
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        sender: 'bot',
        text: 'Here are the latest insights from your dashboard:\n\n**📊 Key Performance Metrics:**\n• **Total Revenue**: $2.4M (↑15.2% vs last month)\n• **Active Users**: 12,847 (↑8.7% vs last month)\n• **Transaction Volume**: 45,892 (↑12.3% vs last month)\n• **Customer Satisfaction**: 94.2% (↑2.1% vs last month)\n\n**🎯 Top Performing Areas:**\n• **Payment Processing**: 99.8% success rate\n• **API Response Time**: 245ms average\n• **System Uptime**: 99.97%\n• **Data Integration**: 98.5% accuracy\n\n**📈 Growth Trends:**\n• Mobile transactions up 23%\n• Healthcare analytics usage increased 45%\n• Customer portal engagement up 18%\n\nWould you like me to analyze any specific metric in detail?',
        timestamp: new Date(Date.now() - 3500000)
      }
    ];

    this.chatMessages = sampleHistory;
  }
}
