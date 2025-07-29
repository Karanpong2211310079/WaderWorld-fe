import { Routes } from '@angular/router';

import { WorkspaceComponent } from './workspace.component';
import { HomeComponent } from './pages/home/home.component';

export const workspaceRoutes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '', // เส้นทางลูกถ้าเข้า '' (root ของ workspace)
        component: HomeComponent,
      },
    ],
  },
];
