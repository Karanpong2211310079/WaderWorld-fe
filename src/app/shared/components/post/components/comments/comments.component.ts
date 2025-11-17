import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Inject } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';

@Component({
  selector: 'app-comments',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  public group_post: any;
  public modalService = inject(NgModalServiceService);
  commentForm = new FormGroup({
    comment: new FormControl('', [
      Validators.required, // ต้องกรอก
      Validators.maxLength(200), // จำกัด 200 ตัวอักษร
    ]),
  });
  public comment: any;

  public calculation_time(timestamp: string): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  public Loadcomments() {
    const payload = {
      group_post_id: this.group_post.id,
    };
    this.restapi.post('group/get_group_post_comments/', payload).subscribe({
      next: (response: any) => {
        this.comment = response?.message || [];
        console.log('Comments loaded:', this.comment);
      },
      error: (err) => console.error('Error loading comments:', err),
    });
  }
  public create_comment() {
    if (this.commentForm.invalid) {
      return;
    }
    const payload = {
      user_id: this.authen.getUserId(),
      group_post_id: this.group_post.id,
      content: this.commentForm.value.comment,
    };
    console.log('Creating comment with payload:', payload);
    this.restapi.post('group/create_group_comment/', payload).subscribe({
      next: (response: any) => {
        console.log('Comment created:', response);
        this.commentForm.reset();
        this.Loadcomments();
      },
      error: (err) => console.error('Error creating comment:', err),
    });
  }

  likesCount = 0;
  commentsCount = 0;

  onLike() {
    this.likesCount++;
    console.log('Liked post', this.group_post.id);
  }

  onComment() {
    console.log('Comment clicked for post', this.group_post.id);
  }

  onShare() {
    console.log('Share clicked for post', this.group_post.id);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    this.group_post = this.value.value;
    console.log(this.group_post.id);
    this.Loadcomments();
  }
  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef, // modal reference
    @Inject('value') public value: any
  ) {}

  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
}
