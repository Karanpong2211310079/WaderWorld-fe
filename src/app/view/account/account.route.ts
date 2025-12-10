import { Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TermConditionsComponent } from './term-conditions/term-conditions.component';
export const accountRoutes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermConditionsComponent,
  },
  {
    path: '', // เส้นทางว่าง (root path)
    redirectTo: 'login', // เปลี่ยนเส้นทางไปที่ 'auth'
    pathMatch: 'full', // ต้องตรงกับเส้นทางทั้งหมด
  },
];
