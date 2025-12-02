import {
  Component,
  inject,
  NgModuleRef,
  OnDestroy,
  OnInit,
  Inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgModalServiceService } from '../../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { RestApiService } from '../../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../../core/service/authentication-service/authentication-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ToastService } from '../../../../../../core/service/toast-service/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnDestroy, OnInit {
  private modalService = inject(NgModalServiceService);
  private restApi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  public userForm: any;
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  public user_data: any;
  public imagePreview: any = null;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any
  ) {}

  ngOnInit(): void {
    console.log('value', this.value.value);
    this.userForm = this.fb.group({
      user_id: [this.value.value.id],
      username: [this.value.value.username || ''],
      bio: [this.value.value.bio || ''],
      image: [this.value.value.image_url || ''],
    });
  }
  public submitForm() {
    if (this.userForm.valid) {
      const value = this.userForm.value;
      const formData = new FormData();

      formData.append('user_id', value.user_id);
      formData.append('username', value.username);
      formData.append('bio', value.bio);

      if (value.image instanceof File) {
        formData.append('profile_image', value.image); // <--- แก้จุดนี้
      }

      this.restApi
        .post('profile/add_info/', formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.toast.success('User updated successfully');
            this.modalService.closeModal(this.modalEl, value);
          },
          error: (err) => {
            console.error('Edit User Error:', err);
            this.toast.error('Something went wrong');
          },
        });
    }
  }

  public getProfileImage() {
    const image = this.userForm?.value?.image;

    // ถ้าเป็นไฟล์ใหม่ → ใช้ preview
    if (image instanceof File && this.imagePreview) {
      return this.imagePreview;
    }

    // ถ้าเป็น URL เดิม → return URL
    if (typeof image === 'string') {
      return image;
    }

    return ''; // fallback
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.userForm.patchValue({ image: file });

      // สร้าง preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }

  ngOnDestroy(): void {}

  public saveProfile() {
    this.modalService.dismissModal(this.modalEl, 'save');
  }
}
