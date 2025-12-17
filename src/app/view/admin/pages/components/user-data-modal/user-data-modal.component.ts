import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-data-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-data-modal.component.html',
  styleUrl: './user-data-modal.component.scss',
})
export class UserDataModalComponent implements OnInit, OnDestroy {
  private toast = inject(ToastService);
  private authen = inject(AuthenticationServiceService);

  private restApi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();
  private modalService = inject(NgModalServiceService);
  public userForm: any;
  private fb = inject(FormBuilder);
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    console.log('User Data Modal Value:', this.value);
    this.userForm = this.fb.group({
      user_id: [this.value.value.id],
      username: [this.value.value.username || ''],
      email: [this.value.value.email || ''],
      bio: [this.value.value.bio || ''],
      image: [this.value.value.image_url], // สำหรับอัปโหลดรูปใหม่
      is_active: [this.value.value.is_active],
    });
  }
  public submitForm() {
    if (this.userForm.invalid) {
      this.toast.error('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    const value = this.userForm.value;
    const formData = new FormData();

    // เพิ่มข้อมูลพื้นฐาน
    formData.append('user_id', value.user_id);
    formData.append('username', value.username || '');
    formData.append('email', value.email || '');
    formData.append('bio', value.bio || '');
    formData.append('is_active', value.is_active ? 'true' : 'false'); // แปลงเป็น string

    // จัดการรูปภาพ
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // ใช้ selectedFile จาก onFileSelected
    }

    console.log('Submitting user data:', {
      user_id: value.user_id,
      username: value.username,
      email: value.email,
      bio: value.bio,
      is_active: value.is_active,
      hasNewImage: !!this.selectedFile,
    });

    this.restApi
      .post('admin/edit_user/', formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log('User updated successfully:', res);
          this.toast.success('User updated successfully');

          // ส่งข้อมูลกลับไปยัง parent component
          this.modalService.closeModal(this.modalEl, {
            action: 'save',
            updatedUser: res.user || res.message,
          });
        },
        error: (err) => {
          console.error('Edit User Error:', err);

          let errorMessage = 'Something went wrong';
          if (err.error && typeof err.error === 'object') {
            // Handle validation errors
            const errors = Object.values(err.error).flat();
            errorMessage = errors.join(', ');
          } else if (err.error && typeof err.error === 'string') {
            errorMessage = err.error;
          }

          this.toast.error(errorMessage);
        },
        complete: () => {
          this.isSubmitting = false; // ย้ายมาใน complete
        },
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        // Show error toast
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.imagePreview = null;
    // Clear file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'close');
  }
}
