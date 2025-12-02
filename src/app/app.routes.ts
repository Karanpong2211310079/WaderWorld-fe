import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './view/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/guard.guard';
import { AccountComponent } from './view/account/account.component';
import { workspaceRoutes } from './view/Home/workspace.route';
import { accountRoutes } from './view/account/account.route';
import { adminRoutes } from './view/admin/admin.routes';
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./view/account/account.route').then((m) => m.accountRoutes),
  },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./view/Home/workspace.route').then((m) => m.workspaceRoutes),
    canActivate: [AuthGuard], // 🔒 ต้องมี token ถึงเข้าหน้านี้ได้
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./view/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [AuthGuard], // 🔒 ต้องมี token ถึงเข้าหน้านี้ได้
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  // 🔽 เพิ่มโค้ดส่วนนี้
  {
    path: '', // เส้นทางว่าง (root path)
    redirectTo: 'auth', // เปลี่ยนเส้นทางไปที่ 'auth'
    pathMatch: 'full', // ต้องตรงกับเส้นทางทั้งหมด
  },
  {
    path: '**', // เส้นทางไวด์การ์ด (จับคู่ URL อื่นๆ ทั้งหมดที่ไม่ตรง)
    redirectTo: 'page-not-found', // เปลี่ยนเส้นทางไปที่ 'auth'
    pathMatch: 'full',
  },
];
