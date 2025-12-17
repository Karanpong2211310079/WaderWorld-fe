import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Inject } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { CommonModule } from '@angular/common'; // ✅ เพิ่ม CommonModule

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, CommonModule], // ✅ เพิ่ม CommonModule
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private cdr = inject(ChangeDetectorRef); // ✅ เพิ่ม ChangeDetectorRef
  private unsubscribe$ = new Subject<void>();
  public modalService = inject(NgModalServiceService);
  public userImage: any;
  public group_post: any;
  public comment: any[] = []; // ✅ เริ่มต้นเป็น array เปล่า

  commentForm = new FormGroup({
    comment: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
  });

  // ✅ เพิ่ม trackBy function
  trackByCommentId = (index: number, item: any): any => {
    return item?.id || index;
  };

  // ✅ เพิ่มฟังก์ชันจัดการ error รูปภาพ
  onImageError(event: any) {
    console.log('Image load error');
    event.target.style.display = 'none';
  }

  public calculation_time(timestamp: string): string {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  public Loadcomments() {
    console.log('🔄 Loading comments for post:', this.group_post?.id);

    if (!this.group_post?.id) {
      console.error('❌ No post ID available');
      return;
    }

    const payload = {
      post_id: this.group_post.id,
    };

    console.log('📤 Sending payload:', payload);

    this.restapi
      .post('post/get_post_comment/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log('📥 Raw API Response:', response);

          if (response && response.message) {
            if (Array.isArray(response.message)) {
              this.comment = response.message;
              console.log('✅ Comments loaded successfully:', this.comment);
              console.log('📊 Comments count:', this.comment.length);
            } else {
              console.warn(
                '⚠️ Response.message is not an array:',
                response.message
              );
              this.comment = [];
            }
          } else {
            console.warn('⚠️ No message in response:', response);
            this.comment = [];
          }

          // ✅ บังคับให้ Angular ตรวจสอบการเปลี่ยนแปลง
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading comments:', err);
          this.comment = [];
          this.cdr.detectChanges();
        },
      });
  }

  public create_comment() {
    console.log('💬 Creating comment...');

    if (this.commentForm.invalid) {
      console.log('❌ Form is invalid');
      return;
    }

    const commentValue = this.commentForm.get('comment')?.value;
    if (!commentValue || commentValue.trim() === '') {
      console.log('❌ Comment is empty');
      return;
    }

    const payload = {
      user_id: this.authen.getUserId(),
      post_id: this.group_post.id,
      content: commentValue.trim(),
    };

    console.log('📤 Creating comment with payload:', payload);

    this.restapi
      .post('post/comment_post/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log('✅ Comment created successfully:', response);
          this.commentForm.reset();

          // ✅ รอสักครู่แล้วโหลดคอมเมนต์ใหม่
          setTimeout(() => {
            this.Loadcomments();
          }, 500);
        },
        error: (err) => {
          console.error('❌ Error creating comment:', err);
        },
      });
  }

  ngOnDestroy(): void {
    console.log('🔄 Component destroying...');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    console.log('🚀 Component initializing...');

    this.group_post = this.value.value;
    console.log('📄 Group post data:', this.group_post);

    // ดึงรูปโปรไฟล์ผู้ใช้
    this.authen
      .getProfile()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (imgUrl) => {
          this.userImage = imgUrl;
          console.log('🖼️ Profile image loaded:', imgUrl);
        },
        error: (err) => {
          console.error('❌ Error getting profile:', err);
          this.userImage = null;
        },
      });

    // โหลดคอมเมนต์
    this.Loadcomments();
  }

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any
  ) {
    console.log('🏗️ Comments component constructed');
  }

  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancel');
  }
}
