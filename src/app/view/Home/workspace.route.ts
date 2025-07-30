import { Routes } from '@angular/router';

import { WorkspaceComponent } from './workspace.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GroupComponent } from './pages/group/group.component';
import { MessageComponent } from './pages/message/message.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { BookmarkComponent } from './pages/bookmark/bookmark.component';

export const workspaceRoutes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'group',
        component: GroupComponent
      },
      {
        path: 'message',
        component: MessageComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'Bookmark',
        component: BookmarkComponent

      }
    ],
  },
];
