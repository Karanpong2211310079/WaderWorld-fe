import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { UserPostComponent } from '../../../../shared/components/user-post/user-post.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  imports: [UserPostComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgModalServiceService);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  public id: any;
  public user_data: any;
  public user_post: any;
  public is_friend: boolean = false;
  public isRequested: boolean = false;
  public friendStatus: 'FOLLOW' | 'REQUESTED' | 'FRIEND' = 'FOLLOW';

  public get_user_profile() {
    const payload = {
      user_id: this.id,
    };

    console.log('Payload for User Profile:', payload);

    this.restapi
      .post('profile/get_profile/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.user_data = response;
        console.log('User Profile Data:', this.user_data);
      });
  }
  public get_user_post() {
    const payload = {
      user_id: this.id,
      visibility: 'PUBLIC', // ถ้าต้องการโชว์โพสต์ตัวเองทั้งหมด ให้ใช้ null ได้
    };

    this.restapi
      .post('post/user_posts/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.user_post = response.message;
        console.log('User Post Data:', this.user_post);
      });
  }

  public handlePostUpdated(event: any) {
    console.log('Post updated event received:', event);

    // รีโหลดโพสต์ทั้งหมดใหม่
    this.get_user_post();
  }
  public formatToThaiMonthDay(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  }
  // user-profile.component.ts
  public goToMessage(friendId: number) {
    const payload = {
      user_ids: [this.authen.getUserId(), friendId],
      chatroom_type: 'PRIVATE',
    };

    this.restapi
      .post('message/create_chatroom/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          const chatroomId = response.chatroom_id;
          console.log('Chatroom ID:', chatroomId);

          // ไปหน้า message component และเลือก chatroom
          this.router.navigate(['/workspace/message'], {
            queryParams: { chatroom_id: chatroomId },
          });
        },
        error: (err) => console.error('Error creating/getting chatroom:', err),
      });
  }

  public check_friend() {
    const payload = {
      user_id: this.authen.getUserId(),
      friend_id: this.id,
    };

    this.restapi
      .post('friends/check_friend/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        const status = response.message.status;
        const isFriend = response.message.is_friend;
        console.log(response);

        if (isFriend && status == 'ACCEPTED') {
          this.friendStatus = 'FRIEND'; // เป็นเพื่อนแล้ว → Message
        } else if (status === 'PENDING') {
          this.friendStatus = 'REQUESTED'; // รออนุมัติ → Requested
        } else {
          this.friendStatus = 'FOLLOW'; // ยังไม่ส่งคำขอ → Follow
        }

        console.log('Friend status:', this.friendStatus);
      });
  }

  public followUser() {
    // กดแล้วเปลี่ยนเป็น REQUESTED ทันที
    this.friendStatus = 'REQUESTED';

    const payload = {
      user_id: this.authen.getUserId(),
      friend_id: this.id,
    };

    this.restapi
      .post('friends/add/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => console.log('✅ Follow request sent'),
        error: (err) => {
          console.error('❌ Follow user error:', err);
          this.friendStatus = 'FOLLOW'; // ถ้า error กลับสถานะเดิม
        },
      });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = params.get('id');
        console.log('PROFILE ID =', this.id);

        this.get_user_profile();
        this.get_user_post();
        this.check_friend(); // เรียกตรงนี้
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
