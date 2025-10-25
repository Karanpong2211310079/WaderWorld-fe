import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationServiceService {
  private cookieService = inject(CookieService);

  setToken(token: string): void {
    this.cookieService.set('auth_token', token);
  }
  getToken(): string {
    return this.cookieService.get('auth_token');
  }

  clearToken(): void {
    this.cookieService.delete('auth_token');
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.user_id || null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
}
