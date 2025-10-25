import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PayloadUserModel } from '../../../core/model/payload.model';
import { Router } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

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

  showPassword = false;
  isLoading = false;

  public form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
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
        next: (response) => {
          if (response == 200) {
            console.log('Login successful:', response);
          } else {
            console.error('Login failed:', response);
          }
        },
      });
  }

  public NavigateLogin() {
    this.router.navigate(['auth/login']);
  }
}
