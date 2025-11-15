import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestApiService } from '../../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../../core/service/authentication-service/authentication-service.service';
import { NgModalServiceService } from '../../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../../core/service/toast-service/toast.service';
@Component({
  selector: 'app-create-group',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
})
export class CreateGroupComponent {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private modalService = inject(NgModalServiceService);
  private toast = inject(ToastService);

  createGroupForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // ✅ ตั้งค่าเริ่มต้น พร้อมดึง user_id อัตโนมัติจาก AuthenticationService
    this.createGroupForm = this.fb.group({
      user_id: [this.authen.getUserId(), Validators.required],
      group_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      image: [null],
      type: ['PUBLIC', Validators.required],
    });
  }

  // แสดง preview รูป
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.createGroupForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  // ส่งฟอร์มไปยัง API
  submitForm() {
    if (this.createGroupForm.invalid) return;
    this.isSubmitting = true;

    const formData = new FormData();
    Object.entries(this.createGroupForm.value).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });
    console.log('Submitting Form Data:', this.createGroupForm.value);

    this.restapi.post('group/create_group/', formData).subscribe({
      next: (res) => {
        this.toast.success('Group created successfully!');
        this.modalService.dismissModal(this.modalEl, 'save');
      },
      error: (err) => {
        console.error('Error:', err);
        this.toast.error('Failed to create group.');
        this.isSubmitting = false;
      },
    });
  }
  public CancleCreateGroup() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
}
