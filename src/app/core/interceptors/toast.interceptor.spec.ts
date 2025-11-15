import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { ToastInterceptor } from './toast.interceptor';
describe('ToastInterceptor', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ToastInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(ToastInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
