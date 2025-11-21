import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PayloadUserRegisterModel } from '../../../core/model/payload.model';
import { Router } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ToastService } from '../../../core/service/toast-service/toast.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private restApi = inject(RestApiService);
  private toast = inject(ToastService);

  showPassword = false;
  isLoading = false;

  public form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {}

  private getUserData(): PayloadUserRegisterModel | undefined {
    if (!this.form.valid) return;
    const formData = this.form.value;
    return {
      username: formData.username,
      password: formData.password,
      email: formData.email,
    };
  }

  public onSubmit() {
    const payload = this.getUserData();
    if (!payload) {
      this.toast.error('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    this.restApi
      .post('auth/register/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.toast.success('Register Successful');
            console.log('Register Successful', response);
          } else {
            this.toast.error(response.message || 'Register Failed');
            console.error('Register failed:', response);
          }
        },
        error: (err) => {
          console.error('Register API error:', err);
          this.toast.error(err.error?.message || 'เกิดข้อผิดพลาด');
        },
      });
  }

  public NavigateLogin() {
    this.router.navigate(['auth/login']);
  }
}
