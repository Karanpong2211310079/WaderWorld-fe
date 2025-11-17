import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { CreateUserPostComponent } from '../../../../shared/components/create-user-post/create-user-post.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserPostComponent } from '../../../../shared/components/user-post/user-post.component';
@Component({
  selector: 'app-home',
  imports: [
    FollowBtnComponent,
    CreateUserPostComponent,
    CommonModule,
    UserPostComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit {
  private modalService = inject(NgModalServiceService);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  public user_post: any;

  public get_user_post() {
    const payload = {
      user_id: this.authen.getUserId(),
      visibility: 'PUBLIC',
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
  ngOnInit(): void {
    this.get_user_post();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('ProfileComponent destroyed');
  }
}
