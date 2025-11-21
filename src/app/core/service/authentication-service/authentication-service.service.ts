import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { RestApiService } from '../rest-api-service/rest-api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationServiceService {
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);
  private restapi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();
  public image_url: any;

  // === CONFIG ===
  private refreshUrl = 'http://127.0.0.1:8000/api/token/refresh/'; // <-- เปลี่ยนตาม Django ของคุณ
  private accessTokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  // === SET TOKEN ===
  setToken(token: string, refreshToken?: string): void {
    this.cookieService.set(this.accessTokenKey, token, {
      path: '/',
      secure: true,
      sameSite: 'Lax',
    });

    if (refreshToken) {
      this.cookieService.set(this.refreshTokenKey, refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'Lax',
      });
    }
  }

  getToken(): string {
    return this.cookieService.get(this.accessTokenKey);
  }

  clearToken(): void {
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
  }

  // === DECODE TOKEN ===
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const cleanToken = token.replace('Bearer ', '');
      const decoded: any = jwtDecode(cleanToken);
      const userId = decoded.user_id;
      return userId !== undefined && userId !== null ? Number(userId) : null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
  // === GET USER ROLE FROM TOKEN ===
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const cleanToken = token.replace('Bearer ', '');
      const decoded: any = jwtDecode(cleanToken);

      // role ที่ embed ไว้ใน token
      const role = decoded.role;

      return role ? role.toString() : null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  // === ตรวจสอบว่า Token หมดอายุหรือยัง ===
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // === Refresh Token ===
  refreshToken(): Observable<boolean> {
    const refresh = this.cookieService.get(this.refreshTokenKey);
    if (!refresh) return of(false);

    return this.http
      .post<{ access: string }>(this.refreshUrl, { refresh })
      .pipe(
        map((res) => {
          if (res.access) {
            this.cookieService.set(this.accessTokenKey, res.access, {
              path: '/',
              secure: true,
              sameSite: 'Lax',
            });
            console.log('Token refreshed');
            return true;
          }
          return false;
        }),
        catchError((err) => {
          console.error('Refresh token failed:', err);
          this.clearToken();
          return of(false);
        })
      );
  }

  logout(): void {
    // ลบ access token + refresh token
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');

    // เคลียร์ค่าใน memory (ถ้ามี)
    this.image_url = null;
  }

  // ใน service
  // AuthenticationServiceService
  getProfile(): Observable<string | null> {
    const userId = this.getUserId();
    if (!userId) return of(null);

    const payload = { user_id: userId };
    return this.restapi.post('profile/get_profile/', payload).pipe(
      map((res: any) => res.image_url),
      catchError((err) => {
        console.error('Error fetching profile:', err);
        return of(null);
      })
    );
  }
}
