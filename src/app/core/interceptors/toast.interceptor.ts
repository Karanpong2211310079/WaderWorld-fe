// src/app/core/interceptors/toast.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ToastService } from '../service/toast-service/toast.service';
@Injectable()
export class ToastInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastService) {
    console.log('ToastInterceptor initialized');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // แสดง info ทันทีเมื่อมี request
    console.log('Intercepted request:', req.url);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const body = event.body as any;
            console.log('HTTP RESPONSE BODY:', body);
            const msg =
              typeof body?.message === 'string'
                ? body.message
                : typeof body?.detail === 'string'
                ? body.detail
                : 'ดำเนินการสำเร็จ';
            this.toastr.success(msg);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('HTTP ERROR:', error);
          console.error('HTTP ERROR BODY:', error.error);

          const errMsg =
            typeof error.error?.message === 'string'
              ? error.error.message
              : typeof error.error?.detail === 'string'
              ? error.error.detail
              : 'เกิดข้อผิดพลาด';
          this.toastr.error(errMsg);
        },
      })
    );
  }
}
