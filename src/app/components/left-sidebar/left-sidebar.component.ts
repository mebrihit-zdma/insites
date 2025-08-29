import { Component, input, output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { SearchChatService } from '../../services/search-chat.service';
import { ChatService } from '../../services/chat.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  
  loginDisplay: boolean = false;

  constructor(private userService: UserService, private loginService: LoginService, private searchChatService: SearchChatService, private chatService: ChatService, private router: Router) {
  }
  
  userName: string | null = 'User Name';
  userRole: string | null = 'Marketing Manager';
  profileImageUrl: string | null = null;
  searchValue: string = "";
 
  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    
    this.userService.userImageUrl$.subscribe(imageUrl => {
      this.profileImageUrl = imageUrl;
    });
    
    this.searchChatService.searchValue$.subscribe(value => {
      this.searchValue = value; 
    });

    this.loginDisplay= this.loginService.getLoginDisplay();
  }

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  dashboardItems = [
    {
      routeLink: 'dashboard',
      icon: 'home',
      label: 'Dashboard',
    },
    {
      routeLink: 'document',
      icon: 'description',
      label: 'Documentation',
    },
    {
      routeLink: 'integrations',
      icon: 'integration_instructions',
      label: 'Integrations',
    },
    {
      routeLink: 'chat',
      icon: 'chat_bubble',
      label: 'Chat',
    },
  ];
  chatItems = [
    {
      icon: 'add_circle_outline',
      label: 'Start New Chat',
    },
    {
      icon: 'search',
      label: 'Search Previous Chats',
    },
  ];
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
  openSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(false);
  }

  //mobile
  isOpen = false; // Sidebar state

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  getFirstLetter(name: string | null): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  // start new chat click event listener 
  startNewChat(){
    this.chatService.startNewChatEmitClick();
    this.router.navigate(['/dashboard-page/chat']);
  };

  // search previous chats click event listener
  searchPreviousChats(){
    this.router.navigate(['/dashboard-page/chat']);
  };
 
  onInputChange(value: string): void {
    this.searchChatService.setSearchValue(value);
    // If search value is not empty, navigate to chat page to show search results
    if (value.trim()) {
      this.router.navigate(['/dashboard-page/chat']);
    }
  }
  chatButton() {
    this.chatService.setIsChatButton(true)
    
  }
}
