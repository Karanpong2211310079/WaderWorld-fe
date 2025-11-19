import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { NgModalServiceService } from '../../../core/service/ng-modal-service/ng-modal-service.service';
import { EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { CommentsComponent } from './component/comments/comments.component';

@Component({
  selector: 'app-user-post',
  imports: [CommonModule],
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.scss',
})
export class UserPostComponent {
  private restapi = inject(RestApiService);
  private toast = inject(ToastService);
  private authen = inject(AuthenticationServiceService);
  private route = inject(ActivatedRoute);
  private unsubscribe$ = new Subject<void>();
  private modalService = inject(NgModalServiceService);
  private router = inject(Router);
  public response: string = '';
  public user_liked: boolean = false; // เก็บสถานะว่า user กดไลค์หรือไม่
  public user_bookmarked: boolean = false; // สถานะ bookmark

  @Input() group_post: any; // ไม่ใช่ any[]
  @Output() postUpdated = new EventEmitter<any>(); // ส่งกลับไป parent

  ngOnInit(): void {
    console.log('group_post', this.group_post);
    this.check_like(this.group_post.id).then((liked) => {
      this.user_liked = liked;
      console.log('User liked status on init:', this.user_liked);
    });
    this.checkBookmark(this.group_post.id).then((bookmarked) => {
      this.user_bookmarked = bookmarked;
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
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
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  editPost() {
    console.log('Edit Post clicked');
    this.menuOpen = false;
  }

  deletePost() {
    console.log('Delete Post clicked');
    this.menuOpen = false;
  }

  public like_post() {
    const payload = {
      user_id: this.authen.getUserId(),
      post_id: this.group_post.id,
    };

    this.restapi
      .post('post/like_post/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.response = response?.message?.message;
          this.user_liked = response?.message?.liked ?? false;
          console.log('Post like status updated:', this.user_liked);

          // ส่ง event ไป parent ว่าโพสต์อัปเดตแล้ว
          this.postUpdated.emit({
            post_id: this.group_post.id,
            liked: this.user_liked,
          });
        },
        error: (err) => console.error('Error liking/unliking post:', err),
      });
  }

  public async check_like(post_id: any): Promise<boolean> {
    const payload = {
      post_id: post_id,
      user_id: this.authen.getUserId(),
    };

    try {
      const response = await firstValueFrom(
        this.restapi.post('post/check_like/', payload)
      );
      console.log('Check like response:', response.message);
      return response.message || false;
    } catch (err) {
      console.error('Error checking like status:', err);
      return false;
    }
  }

  // public check_like(post_id: any): void {
  //   const payload = {
  //     group_post_id: post_id,
  //     user_id: this.authen.getUserId(),
  //   };
  //   this.restapi
  //     .post('group/check_group_post_like/', payload)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe({
  //       next: (response: any) => {
  //         this.user_liked = response?.message || false;
  //         console.log('User liked status:', this.user_liked);
  //       },
  //       error: (err) => console.error('Error checking like status:', err),
  //     });
  // }

  public comment_modal() {
    const post = this.group_post;

    this.modalService.openTemplateModal(
      'Edit Profile',
      {
        autoCloseRoutingChange: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: false,
      },
      {
        componentRef: CommentsComponent,
        value: post,
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public toggleBookmark() {
    const payload = {
      user_id: this.authen.getUserId(),
      post_id: this.group_post.id,
    };

    this.restapi
      .post('post/bookmark/create/', payload) // ใช้ API toggle ของ Django
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.user_bookmarked = res.bookmarked;
          console.log('Bookmark toggled:', this.user_bookmarked);
        },
        error: (err) => console.error('Error toggling bookmark:', err),
      });
  }

  // check bookmark status
  public async checkBookmark(post_id: number): Promise<boolean> {
    const payload = {
      user_id: this.authen.getUserId(),
      post_id: post_id,
    };

    try {
      const res: any = await firstValueFrom(
        this.restapi.post('post/bookmark/check/', payload)
      );
      return res.bookmarked || false;
    } catch (err) {
      console.error('Error checking bookmark:', err);
      return false;
    }
  }
}
