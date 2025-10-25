import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PayloadUserModel } from '../../../core/model/payload.model';
import { Router } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { delay, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ResponseMessageModel } from '../../../core/model/response.model';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
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

  private getUserData(): PayloadUserModel | undefined {
    if (!this.form.valid) return undefined;
    const formData = this.form.value;
    return {
      username: formData.username,
      password: formData.password,
    };
  }

  public onSubmit() {
    const payload = this.getUserData();
    console.log(payload);
    this.restApi
      .post('auth/login/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ResponseMessageModel) => {
          if (response.code == 200) {
            this.authService.setToken(response.data.tokens.access);
            delay(3000);
            this.router.navigate(['workspace']);
          } else {
            console.error('Login failed:', response);
          }
        },
      });
  }

  public NavigateSignup() {
    this.router.navigate(['auth/register']);
  }
}
