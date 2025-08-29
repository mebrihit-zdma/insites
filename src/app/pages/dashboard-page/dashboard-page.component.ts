import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { LeftSidebarComponent } from '../../components/left-sidebar/left-sidebar.component';
import { MainContentComponent } from '../../components/main-content/main-content.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [LeftSidebarComponent, MainContentComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  isLeftSidebarCollapsed = signal<boolean>(false);

  private sidebarEventListener!: (event: Event) => void;

  ngOnInit() {
    // Listen for sidebar toggle events from dashboard component
    this.sidebarEventListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.shouldClose) {
        this.isLeftSidebarCollapsed.set(true);
      } else if (customEvent.detail?.shouldOpen) {
        this.isLeftSidebarCollapsed.set(false);
      }
    };

    window.addEventListener('dashboardSidebarToggle', this.sidebarEventListener);
    window.addEventListener('reopenSidebarAfterChatbot', this.sidebarEventListener);
  }

  ngOnDestroy() {
    if (this.sidebarEventListener) {
      window.removeEventListener('dashboardSidebarToggle', this.sidebarEventListener);
      window.removeEventListener('reopenSidebarAfterChatbot', this.sidebarEventListener);
    }
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
