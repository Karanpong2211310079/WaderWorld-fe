import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { ToastService } from '../../../core/service/toast-service/toast.service';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Component({
  selector: 'app-create-user-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-post.component.html',
  styleUrl: './create-user-post.component.scss',
})
export class CreateUserPostComponent implements OnDestroy, OnInit {
  @Input() placeholderText: string = "What's on your mind?";

  public authen = inject(AuthenticationServiceService);
  private restapi = inject(RestApiService);
  private toast = inject(ToastService);
  private unsubscribe$ = new Subject<void>();

  public form = new FormGroup({
    user_id: new FormControl<number | null>(this.authen.getUserId(), [
      Validators.required,
    ]),
    content: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1000),
    ]),
    media: new FormControl<File | null>(null),

    visibility: new FormControl<VisibilityType>(VisibilityType.PUBLIC, [
      Validators.required,
    ]),
  });
  selectedImage: string | ArrayBuffer | null = null;
  isUploading: boolean = false;

  triggerImageUpload() {
    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    fileInput?.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.isUploading = true;
      const file = input.files[0];
      this.form.patchValue({ media: file });

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.selectedImage = reader.result;
          this.isUploading = false;
        }, 1500); // simulate 1.5s loading
      };
      reader.readAsDataURL(file);
    }
  }

  public onCreate() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('user_id', String(this.authen.getUserId()));
    formData.append('visibility', this.form.value.visibility!);

    if (this.form.value.content)
      formData.append('content', this.form.value.content);

    if (this.form.value.media) formData.append('media', this.form.value.media);

    this.restapi
      .post('post/create/', formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.toast.success('โพสต์สำเร็จ!');
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.toast.error('เกิดข้อผิดพลาดในการโพสต์');
        },
      });
  }

  resetForm() {
    this.form.reset({
      user_id: this.authen.getUserId(), // keep current user_id
      content: '',
      media: null,
    });
    this.selectedImage = null;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
