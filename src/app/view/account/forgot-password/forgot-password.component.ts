import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  isLoading: boolean = false;

  // Step 1: Email Form
  emailForm: FormGroup;

  // Step 2: Verification Code
  verificationCode: string[] = ['', '', '', '', '', ''];
  codeError: string = '';
  resendTimer: number = 0;
  private resendInterval: any;

  // Step 3: Password Form
  passwordForm: FormGroup;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize Email Form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Initialize Password Form
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  // Password Match Validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  // Step 1: Send Verification Code
  sendVerificationCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log(
        'Sending verification code to:',
        this.emailForm.get('email')?.value
      );
      this.isLoading = false;
      this.currentStep = 2;
      this.startResendTimer();
    }, 1500);
  }

  // Step 2: Verification Code Input Handling
  onCodeInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (value.length > 0) {
      this.verificationCode[index] = value[value.length - 1];
      input.value = this.verificationCode[index];

      // Move to next input
      if (index < 5) {
        const nextInput = document.getElementById(
          `code-${index + 1}`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }

      // Add filled class
      input.classList.add('filled');
    } else {
      this.verificationCode[index] = '';
      input.classList.remove('filled');
    }

    this.codeError = '';
  }

  onCodeKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(
        `code-${index - 1}`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }

  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim();

    if (pastedData && /^\d{6}$/.test(pastedData)) {
      for (let i = 0; i < 6; i++) {
        this.verificationCode[i] = pastedData[i];
        const input = document.getElementById(`code-${i}`) as HTMLInputElement;
        if (input) {
          input.value = pastedData[i];
          input.classList.add('filled');
        }
      }

      // Focus last input
      const lastInput = document.getElementById('code-5') as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    }
  }

  isCodeComplete(): boolean {
    return this.verificationCode.every((digit) => digit !== '');
  }

  verifyCode(): void {
    if (!this.isCodeComplete()) {
      this.codeError = 'Please enter all 6 digits';
      return;
    }

    this.isLoading = true;
    const code = this.verificationCode.join('');

    // Simulate API call
    setTimeout(() => {
      console.log('Verifying code:', code);

      // Simulate success (in real app, check with backend)
      if (code === '123456') {
        this.isLoading = false;
        this.currentStep = 3;
        this.stopResendTimer();
      } else {
        this.isLoading = false;
        this.codeError = 'Invalid verification code. Please try again.';
        // Clear inputs
        this.verificationCode = ['', '', '', '', '', ''];
        for (let i = 0; i < 6; i++) {
          const input = document.getElementById(
            `code-${i}`
          ) as HTMLInputElement;
          if (input) {
            input.value = '';
            input.classList.remove('filled');
          }
        }
        // Focus first input
        const firstInput = document.getElementById(
          'code-0'
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 1500);
  }

  // Resend Code
  resendCode(): void {
    if (this.resendTimer > 0) return;

    console.log('Resending code to:', this.emailForm.get('email')?.value);
    this.startResendTimer();

    // Clear code inputs
    this.verificationCode = ['', '', '', '', '', ''];
    this.codeError = '';
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`code-${i}`) as HTMLInputElement;
      if (input) {
        input.value = '';
        input.classList.remove('filled');
      }
    }
  }

  startResendTimer(): void {
    this.resendTimer = 60;
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.stopResendTimer();
      }
    }, 1000);
  }

  stopResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
    this.resendTimer = 0;
  }

  // Step 3: Reset Password
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Resetting password...');
      this.isLoading = false;

      // Show success message and redirect
      alert('Password reset successful! Please login with your new password.');
      this.router.navigate(['/login']);
    }, 1500);
  }

  // Password Requirements Check
  hasMinLength(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return password.length >= 6;
  }

  hasUpperCase(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /\d/.test(password);
  }

  // Toggle Password Visibility
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Navigation
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
