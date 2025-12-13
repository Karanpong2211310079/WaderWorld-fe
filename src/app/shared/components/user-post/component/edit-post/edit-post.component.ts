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
interface Category {
  value: string; // รหัสที่ส่งไป Backend (เช่น 'BEACH')
  label: string; // ข้อความที่แสดงให้ผู้ใช้เห็น (เช่น 'ทะเล')
  emoji: string; // (ทางเลือก: สำหรับเพิ่มสีสัน)
}
@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
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

  public categories: Category[] = [
    // รายการเดิม
    { value: 'OTHER', label: 'Other', emoji: '❓' },
    { value: 'BEACH', label: 'Sea & Islands', emoji: '🏖️' },
    { value: 'MOUNTAIN', label: 'Mountains & Hills', emoji: '⛰️' },
    { value: 'FOREST', label: 'Forest', emoji: '🌳' },
    { value: 'TOURIST_SPOT', label: 'Tourist Spots', emoji: '📍' },

    // รายการที่เพิ่มใหม่
    { value: 'CAMPING', label: 'Camping', emoji: '🏕️' },
    { value: 'TEMPLE_MERIT', label: 'Temples & Merit Making', emoji: '🛕' },
    { value: 'FOOD_CAFE', label: 'Food & Cafes', emoji: '☕' },
    { value: 'THEME_WATER_PARK', label: 'Theme & Water Parks', emoji: '🎢' },
    { value: 'ADVENTURE', label: 'Hiking & Adventure', emoji: '🧗' },
    { value: 'NIGHTLIFE', label: 'Nightlife & Party', emoji: '🍻' },
    { value: 'VOLUNTEERING', label: 'Volunteering', emoji: '🤝' },
    { value: 'PHOTOGRAPHY', label: 'Photography', emoji: '📸' },
    { value: 'CONCERT', label: 'Concerts', emoji: '🎤' },
    { value: 'WATERFALL', label: 'Waterfalls & Nature', emoji: '🏞️' },
    { value: 'CITY_TRIP', label: 'City Sightseeing', emoji: '🏙️' },
    { value: 'DIVING', label: 'Diving', emoji: '🤿' },
  ];

  visibilities = [
    { value: 'PUBLIC', label: 'Public' },
    { value: 'FRIENDS', label: 'Friends' },
    { value: 'PRIVATE', label: 'Private' },
  ];

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any
  ) {
    this.editPostForm = this.fb.group({
      user_id: [null, Validators.required],
      post_id: [null, Validators.required],
      content: ['', [Validators.required, Validators.maxLength(500)]],
      media: [null],
      visibility: ['PUBLIC', Validators.required],
      category: ['OTHER'],
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
        category: postData.category || 'OTHER',
        visibility: postData.visibility || 'PUBLIC',
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

    this.isSubmitting = true;
    const formData = new FormData();

    // Add basic form data
    Object.keys(this.editPostForm.value).forEach((key) => {
      if (
        key !== 'media' &&
        this.editPostForm.value[key] !== null &&
        this.editPostForm.value[key] !== undefined
      ) {
        formData.append(key, this.editPostForm.value[key]);
      }
    });

    // Add media if selected
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
      console.log('Submitting with media:', this.selectedFile.name);
    }

    console.log('Submitting form data:', {
      hasMedia: !!this.selectedFile,
      selectedFile: this.selectedFile?.name,
    });

    this.restapi
      .post('post/edit_post/', formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          console.log('Post updated successfully:', res);
          this.toast.success(res.detail || 'Post updated successfully!');
          this.modalService.closeModal(this.modalEl);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error updating post:', err);
          this.toast.error(err.error?.detail || 'Error updating post!');
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
