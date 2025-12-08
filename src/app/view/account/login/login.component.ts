import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PayloadUserLoginModel } from '../../../core/model/payload.model';
import { Router } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ResponseMessageModel } from '../../../core/model/response.model';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { ToastService } from '../../../core/service/toast-service/toast.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private restApi = inject(RestApiService);
  private authService = inject(AuthenticationServiceService);
  private toast = inject(ToastService);

  showPassword = false;
  isLoading = false;

  public form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {}

  private getUserData(): PayloadUserLoginModel | undefined {
    if (!this.form.valid) return undefined;
    const formData = this.form.value;
    return {
      username: formData.username,
      password: formData.password,
    };
  }

  public onSubmit() {
    const payload = this.getUserData();
    if (!payload) {
      this.toast.error('กรุณากรอก username และ password');
      return;
    }

    this.restApi
      .post('auth/login/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ResponseMessageModel) => {
          if (response.code === 200) {
            this.authService.setToken(response.data.tokens.access);
            this.toast.success('Login successful'); // ✅ toast custom
            this.router.navigate(['workspace']);
          } else {
            this.toast.error(response.message || 'Login failed');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.toast.error(
            err.error?.message || 'An error occurred during login'
          );
        },
      });
  }

  public NavigateSignup() {
    this.router.navigate(['auth/register']);
  }
  public NavigateForgotPass() {
    this.router.navigate(['auth/forgot-password']);
  }
}
