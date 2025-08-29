import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor() {
    console.log('Chatbot component loaded!');
  }

  showChatbot = false;
  chatMessages: Array<{text: string, isUser: boolean}> = [];
  chatInput = '';
  isTyping = false;
  quickActions = [
    'Show trends',
    'Compare states',
    'Growth analysis',
    'Data insights'
  ];

  openChatbot() {
    console.log('Chatbot opened!');
    this.showChatbot = true;
    this.chatMessages = [];
    this.addWelcomeMessage();
    this.sidebarToggle.emit(true); // Close sidebar
  }

  closeChatbot() {
    this.showChatbot = false;
    this.chatInput = '';
    this.isTyping = false;
    this.sidebarToggle.emit(false); // Reopen sidebar
  }

  addWelcomeMessage() {
    this.chatMessages.push({
      text: "Hello! I'm your Insites Assistant. I can help you analyze your healthcare data. What would you like to know?",
      isUser: false
    });
  }

  sendChatMessage() {
    if (!this.chatInput.trim()) return;
    
    const userMessage = this.chatInput.trim();
    this.chatMessages.push({
      text: userMessage,
      isUser: true
    });
    
    this.chatInput = '';
    this.isTyping = true;
    
    // Simulate bot response
    setTimeout(() => {
      this.isTyping = false;
      const botResponse = this.generateBotResponse(userMessage);
      this.chatMessages.push({
        text: botResponse,
        isUser: false
      });
    }, 1500);
  }

  sendQuickAction(action: string) {
    this.chatInput = action;
    this.sendChatMessage();
  }

  generateBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('trend') || message.includes('growth')) {
      return "Based on your data, the current growth rate shows positive trends in healthcare demand.";
    }
    
    if (message.includes('compare') || message.includes('state')) {
      return "I can help you compare data across different states. What specific metrics would you like to compare?";
    }
    
    if (message.includes('analysis') || message.includes('insight')) {
      return "Here's a key insight: Your data shows strong correlation between different healthcare metrics.";
    }
    
    return `I understand you're asking about "${userMessage}". Let me analyze your data and provide insights.`;
  }
}
