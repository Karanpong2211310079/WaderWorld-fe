import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { UserPostComponent } from '../../../../shared/components/user-post/user-post.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, PostComponent, UserPostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnDestroy, OnInit {
  private modalService = inject(NgModalServiceService);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  public user_data: any = null;
  public user_post: any[] = [];
  public id: number = 0;

  // ✔️ โหลดข้อมูลโปรไฟล์
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

  // ✔️ โหลดโพสต์ของยูสเซอร์
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

  public formatToThaiMonthDay(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  }

  ngOnInit(): void {
    this.id = Number(this.authen.getUserId());
    this.get_user_profile();
    this.get_user_post();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('ProfileComponent destroyed');
  }
  public handlePostUpdated(event: any) {
    console.log('Post updated event received:', event);

    // รีโหลดโพสต์ทั้งหมดใหม่
    this.get_user_post();
  }

  // ✔️ เปิด modal แก้ไขโปรไฟล์
  openEditProfile() {
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
        componentRef: EditProfileComponent,
        value: '',
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
}
