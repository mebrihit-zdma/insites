import { Routes} from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { DocumentationComponent } from './components/documentation/documentation.component';
import { IntegrationsComponent } from './components/integrations/integrations.component';
import { ChatComponent } from './components/chat/chat.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard-page', pathMatch: 'full' },
    { path: 'dashboard-page', 
      component: DashboardPageComponent,
      children: [
          { path: '', component: DashboardComponent },
          { path: 'dashboard', component: DashboardComponent },

          { path: 'document', component: DocumentationComponent },
          { path: 'integrations', component: IntegrationsComponent },
          { path: 'chat', component: ChatComponent },
        ] 
    },
];