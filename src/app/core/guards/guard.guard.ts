import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthenticationServiceService } from '../service/authentication-service/authentication-service.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationServiceService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken(); // ฟังก์ชันของคุณที่ดึง JWT
    if (token) {
      return true; // มี token → อนุญาตเข้าหน้านี้
    } else {
      this.router.navigate(['/auth']); // ไม่มี token → ไปหน้า login
      return false;
    }
  }
}
