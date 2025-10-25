import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
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
}
