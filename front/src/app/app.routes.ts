import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { ServiceClientComponent } from './service-client/service-client.component';

export const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    title: 'Chat'
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Chat'
  },
  {
    path: 'chat/service-client',
    component: ServiceClientComponent,
    title: 'Chat'
  }
];
