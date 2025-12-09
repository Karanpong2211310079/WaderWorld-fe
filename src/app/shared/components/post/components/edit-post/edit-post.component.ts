import {
  Component,
  inject,
  Inject,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';

@Component({
  selector: 'app-edit-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditPostComponent implements OnInit, OnDestroy {
  private restapi = inject(RestApiService);
  private fb = inject(FormBuilder);
  private unsubscribe$ = new Subject<void>();
  private authen = inject(AuthenticationServiceService);
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);

  editPostForm: FormGroup;
  selectedFile: File | null = null;
  mediaPreview: string | null = null;
  public isSubmitting: boolean = false;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any // group post data
  ) {
    this.editPostForm = this.fb.group({
      user_id: [null, Validators.required],
      post_id: [null, Validators.required],
      content: ['', [Validators.required, Validators.maxLength(500)]],
      media: [null],
    });
  }

  ngOnInit(): void {
    console.log('EditPostComponent initialized with value:', this.value);

    if (this.value) {
      // Handle different data structures
      const postData = this.value.value || this.value;

      this.editPostForm.patchValue({
        user_id: this.authen.getUserId(),
        post_id: postData.id,
        content: postData.content,
      });

      // Set media preview if exists
      const mediaUrl =
        this.value.media_url || postData.media_url || postData.media || null;
      if (mediaUrl) {
        this.mediaPreview = mediaUrl;
        console.log('Found media URL:', mediaUrl);
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFileChange(event: any): void {
    const file = event.target.files && event.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];

      if (!allowedTypes.includes(file.type)) {
        this.toast.error(
          'Please select a valid image file (JPG, PNG, GIF, WebP)'
        );
        return;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.toast.error('File size must be less than 10MB');
        return;
      }

      this.selectedFile = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.mediaPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      console.log('New media selected:', file.name);
    }
  }

  submit(): void {
    if (this.editPostForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.editPostForm.value;

    if (!formValue.post_id || isNaN(formValue.post_id)) {
      return this.toast.error('Post ID is invalid!');
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // Add basic form data
    formData.append('post_id', formValue.post_id.toString());
    formData.append('user_id', formValue.user_id.toString());
    formData.append('content', formValue.content || '');

    // Add media if selected
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
      console.log('Submitting with media:', this.selectedFile.name);
    }

    console.log('Submitting group post data:', {
      post_id: formValue.post_id,
      hasMedia: !!this.selectedFile,
      selectedFile: this.selectedFile?.name,
    });

    this.restapi
      .post('group/group_post/edit/', formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          console.log('Group post updated successfully:', res);
          this.toast.success(res.detail || 'Group post updated successfully!');
          this.modalService.closeModal(this.modalEl);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error updating group post:', err);
          this.toast.error(err.error?.detail || 'Error updating group post!');
          this.isSubmitting = false;
        },
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editPostForm.controls).forEach((key) => {
      this.editPostForm.get(key)?.markAsTouched();
    });
  }

  public closeModal(): void {
    this.modalService.dismissModal(this.modalEl, 'cancel');
  }

  // Getter methods for template
  get contentLength(): number {
    return this.editPostForm.get('content')?.value?.length || 0;
  }
}
