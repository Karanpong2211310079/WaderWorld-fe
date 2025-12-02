import { Component, Input, inject } from '@angular/core';
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

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'], // fixed typo
})
export class CreatePostComponent {
  @Input() placeholderText: string = "What's on your mind?";
  @Input() group_id: number | null = null;
  @Input() State: 'createpost' | 'creategrouppost' = 'createpost';

  private restapi = inject(RestApiService);
  private toast = inject(ToastService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  public userImage: any;

  private user_id = this.authen.getUserId();
  public form = new FormGroup({
    group_id: new FormControl<number | null>(this.group_id),
    user_id: new FormControl<number | null>(this.authen.getUserId(), [
      Validators.required,
    ]),
    content: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1000),
    ]),
    media: new FormControl<File | null>(null),
  });
  ngOnInit(): void {
    this.authen.getProfile().subscribe((imgUrl) => {
      this.userImage = imgUrl; // เก็บไว้ใช้ใน template
    });
  }
  selectedImage: string | ArrayBuffer | null = null;
  isUploading: boolean = false;

  triggerImageUpload() {
    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    fileInput?.click();
  }
  clearImage() {
    this.selectedImage = null;
    this.form.patchValue({ media: null });

    // เคลียร์ค่าจาก input file จริง ๆ
    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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

    const CreatePostUrl = 'post/create_post/';
    const CreateGroupPostUrl = 'group/create_group_post/';
    const apiUrl =
      this.State === 'createpost' ? CreatePostUrl : CreateGroupPostUrl;

    const formData = new FormData();
    if (this.group_id) formData.append('group_id', String(this.group_id));
    formData.append('user_id', String(this.authen.getUserId()));
    if (this.form.value.content)
      formData.append('content', this.form.value.content);
    if (this.form.value.media) formData.append('media', this.form.value.media);

    this.restapi
      .post(apiUrl, formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.toast.success('Post successful!');
          this.resetForm();
        },
        error: (err) => {
          this.toast.error('An error occurred while posting');
        },
      });
  }

  resetForm() {
    this.form.reset({
      group_id: null,
      user_id: this.authen.getUserId(), // keep current user_id
      content: '',
      media: null,
    });
    this.selectedImage = null;
  }
}
