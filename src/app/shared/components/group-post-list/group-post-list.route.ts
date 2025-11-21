import { Routes } from '@angular/router';
import { GroupPostListComponent } from './group-post-list.component';

export const workspaceRoutes: Routes = [
  {
    path: 'workspace/group/:id',
    component: GroupPostListComponent,
  },
];
