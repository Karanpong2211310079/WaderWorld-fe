import { Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


export const accountRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path:'register',
        component: RegisterComponent,
    }
];