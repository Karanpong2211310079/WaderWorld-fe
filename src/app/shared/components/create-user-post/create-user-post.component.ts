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
import Swal from 'sweetalert2';

export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
interface Category {
  value: string; // รหัสที่ส่งไป Backend (เช่น 'BEACH')
  label: string; // ข้อความที่แสดงให้ผู้ใช้เห็น (เช่น 'ทะเล')
  emoji: string; // (ทางเลือก: สำหรับเพิ่มสีสัน)
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
  public userImage: any;
  public categories: Category[] = [
    // รายการเดิม
    { value: 'OTHER', label: 'Other', emoji: '❓' },
    { value: 'BEACH', label: 'Sea & Islands', emoji: '🏖️' },
    { value: 'MOUNTAIN', label: 'Mountains & Hills', emoji: '⛰️' },
    { value: 'FOREST', label: 'Forest', emoji: '🌳' },
    { value: 'TOURIST_SPOT', label: 'Tourist Spots', emoji: '📍' },

    // รายการที่เพิ่มใหม่ (อ้างอิงจาก PostCategory)
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

    // เพิ่มเติมจากหมวดหมู่ในรูปภาพ
    { value: 'CITY_TRIP', label: 'City Sightseeing', emoji: '🏙️' },
    { value: 'DIVING', label: 'Diving', emoji: '🤿' },
  ];

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
    category: new FormControl<string>('TOURIST_SPOT', Validators.required), // fix default OTHER
  });
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

    // เคลียร์ value ใน input file จริง ๆ
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

    const formData = new FormData();
    formData.append('user_id', String(this.authen.getUserId()));
    formData.append('visibility', this.form.value.visibility!);
    formData.append('content', this.form.value.content ?? '');
    formData.append('category', this.form.value.category ?? 'OTHER');

    if (this.form.value.media) {
      formData.append('media', this.form.value.media);
    }

    this.restapi
      .post('post/create/', formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.toast.success('Post successful!');

          Swal.fire({
            icon: 'success',
            title: '🎉 Post created!',
            text: 'Your post has been successfully published.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.resetForm();
            location.reload(); // 🔥 รีหน้าเว็บตรงนี้
          });
        },
        error: (err) => {
          this.toast.error('An error occurred while posting');
        },
      });
  }

  resetForm() {
    this.form.reset({
      user_id: this.authen.getUserId(), // keep current user_id
      content: '',
      media: null,
      category: 'OTHER',
    });
    this.selectedImage = null;
  }

  ngOnInit(): void {
    this.authen.getProfile().subscribe((imgUrl) => {
      this.userImage = imgUrl; // เก็บไว้ใช้ใน template
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
