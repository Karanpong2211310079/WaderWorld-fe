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
    if (this.userForm.valid) {
      const value = this.userForm.value;
      const formData = new FormData();

      formData.append('user_id', value.user_id);
      formData.append('username', value.username);
      formData.append('email', value.email);
      formData.append('bio', value.bio);
      formData.append('is_active', value.is_active);

      if (value.image instanceof File) {
        formData.append('image', value.image); // เฉพาะไฟล์ใหม่
      }

      this.restApi
        .post('admin/edit_user/', formData)
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

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.userForm.patchValue({ image: input.files[0] });
    }
  }

  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'close');
  }
}
