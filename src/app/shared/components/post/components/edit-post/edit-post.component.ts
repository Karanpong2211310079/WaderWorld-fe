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
import { Subject } from 'rxjs';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';

@Component({
  selector: 'app-edit-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent {
  private restapi = inject(RestApiService);
  private fb = inject(FormBuilder);
  private authen = inject(AuthenticationServiceService);
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);

  editPostForm: FormGroup;
  selectedFile: File | null = null;
  mediaPreview: string | null = null;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any // group post data
  ) {
    this.editPostForm = this.fb.group({
      user_id: [null, Validators.required],
      post_id: [null, Validators.required],
      content: ['', Validators.required],
      media: [null],
    });
  }

  ngOnInit(): void {
    if (this.value) {
      this.editPostForm.patchValue({
        user_id: this.authen.getUserId(),
        post_id: this.value.value.id,
        content: this.value.value.content,
      });

      if (this.value.media_url) {
        this.mediaPreview = this.value.media_url;
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => (this.mediaPreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const formValue = this.editPostForm.value;

    if (!formValue.post_id || isNaN(formValue.post_id)) {
      return this.toast.error('post_id is invalid!');
    }

    const formData = new FormData();
    formData.append('post_id', formValue.post_id.toString());
    formData.append('user_id', formValue.user_id.toString());
    formData.append('content', formValue.content || '');

    // Append media เฉพาะเมื่อมีไฟล์ใหม่
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
    }
    // ถ้าอยากลบรูปเดิมให้ append 'media' = null
    // else formData.append('media', null); // optional

    this.restapi.post('group/group_post/edit/', formData).subscribe({
      next: (res: any) => {
        this.toast.success(res.detail);
        this.modalService.closeModal(this.modalEl);
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Error!');
      },
    });
  }

  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
}
