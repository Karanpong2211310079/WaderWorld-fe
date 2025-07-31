import { Routes } from '@angular/router';
import { AccountComponent } from './view/account/account.component';
import { workspaceRoutes } from './view/Home/workspace.route';
import { accountRoutes } from './view/account/account.route';
import { adminRoutes } from './view/admin/admin.routes';
export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./view/account/account.route').then((m)=> accountRoutes)
    },
    {
        path: 'workspace',
        loadChildren: () => import('./view/Home/workspace.route').then((m) => workspaceRoutes)
    },
    {
        path:'admin',
        loadChildren: () => import('./view/admin/admin.routes').then((m) => adminRoutes)
    }
        

];
