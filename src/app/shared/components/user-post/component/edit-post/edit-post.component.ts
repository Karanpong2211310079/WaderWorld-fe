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

  categories = [
    { value: 'BEACH', label: 'Beach' },
    { value: 'MOUNTAIN', label: 'Mountain' },
    { value: 'FOREST', label: 'Forest' },
    { value: 'TOURIST_SPOT', label: 'Tourist Spot' },
    { value: 'OTHER', label: 'Other' },
  ];

  visibilities = [
    { value: 'PUBLIC', label: 'Public' },
    { value: 'FRIENDS', label: 'Friends' },
    { value: 'PRIVATE', label: 'Private' },
  ];

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef, // modal reference
    @Inject('value') public value: any // post data
  ) {
    this.editPostForm = this.fb.group({
      user_id: [null, Validators.required],
      post_id: [null, Validators.required],
      content: ['', Validators.required],
      media: [null],
      visibility: ['PUBLIC', Validators.required],
      category: ['OTHER'],
    });
  }

  ngOnInit(): void {
    if (this.value) {
      this.editPostForm.patchValue({
        user_id: this.authen.getUserId(),
        post_id: this.value.value.id,
        content: this.value.value.content,
        category: this.value.value.category || 'OTHER',
        visibility: this.value.value.visibility || 'PUBLIC',
      });

      // media preview
      if (this.value.media_url) {
        this.mediaPreview = this.value.media_url;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;

      // show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.mediaPreview = reader.result as string;
      };
      reader.readAsDataURL(file); // ใช้ file แทน this.selectedFile เพื่อปลอดภัย
    }
  }

  submit() {
    const formData = new FormData();

    // loop fields
    Object.keys(this.editPostForm.value).forEach((key) => {
      if (key === 'media' && this.selectedFile) {
        formData.append('media', this.selectedFile); // append file
      } else if (
        this.editPostForm.value[key] !== null &&
        this.editPostForm.value[key] !== undefined
      ) {
        formData.append(key, this.editPostForm.value[key]);
      }
    });

    this.restapi.post('post/edit_post/', formData).subscribe({
      next: (res: any) => {
        this.toast.success(res.detail);
        this.modalService.closeModal(this.modalEl);
      },
      error: (err) => {
        this.toast.error(err.error.detail || 'Error!');
      },
    });
  }
  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
}
