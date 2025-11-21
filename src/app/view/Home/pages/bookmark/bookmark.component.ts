import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { UserPostComponent } from '../../../../shared/components/user-post/user-post.component';
import { PostComponent } from '../../../../shared/components/post/post.component';
@Component({
  selector: 'app-bookmark',
  imports: [CommonModule, UserPostComponent, PostComponent],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.scss',
})
export class BookmarkComponent implements OnInit, OnDestroy {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  public postBookmarks: any[] = [];
  public groupPostBookmarks: any[] = [];
  public loading: boolean = true;

  ngOnInit(): void {
    this.user_bookmarked();
    this.user_group_bookmarked();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public user_bookmarked() {
    const Payload = {
      user_id: this.authen.getUserId(),
    };
    console.log(Payload);
    this.restapi
      .post('post/bookmark/user/', Payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.postBookmarks = response?.message;
          console.log('postBookmarks', this.postBookmarks);
        },
        error: (err) => console.error('Error liking/unliking post:', err),
      });
  }

  public user_group_bookmarked() {
    const payload = { user_id: this.authen.getUserId() };
    this.restapi
      .post('group/group_post/get_user_bookmarked/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.groupPostBookmarks = res?.message || [];
          console.log('groupPostBookmarks', this.groupPostBookmarks);
        },
        error: (err) =>
          console.error('Error fetching group post bookmarks:', err),
      });
  }
  public handlePostUpdated(event: any) {
    console.log('Post updated event received:', event);

    // รีโหลดโพสต์ทั้งหมดใหม่
    this.user_bookmarked();
    this.user_group_bookmarked();
  }
}
