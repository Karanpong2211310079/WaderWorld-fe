import { Routes } from '@angular/router';

import { WorkspaceComponent } from './workspace.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GroupComponent } from './pages/group/group.component';
import { MessageComponent } from './pages/message/message.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { BookmarkComponent } from './pages/bookmark/bookmark.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { GroupPostListComponent } from '../../shared/components/group-post-list/group-post-list.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { GooglemapComponent } from './pages/googlemap/googlemap.component';
import { AirlineComponent } from './pages/airline/airline.component';
export const workspaceRoutes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'profile/:id',
        component: UserProfileComponent,
      },
      {
        path: 'group',
        component: GroupComponent, // หน้า list ของกลุ่มทั้งหมด
      },
      {
        path: 'group/:id',
        component: GroupPostListComponent, // หน้า detail ของแต่ละ group
      },
      {
        path: 'message',
        component: MessageComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
      {
        path: 'Bookmark',
        component: BookmarkComponent,
      },
      {
        path: 'Friends',
        component: FriendsComponent,
      },
      {
        path: 'google-map',
        component: GooglemapComponent,
      },
      {
        path: 'Airline',
        component: AirlineComponent,
      },
    ],
  },
];
