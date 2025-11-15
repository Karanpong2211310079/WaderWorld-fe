import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { RouterOutlet } from '@angular/router';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
@Component({
  selector: 'app-profile',
  imports: [PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnDestroy, OnInit {
  private modalService = inject(NgModalServiceService);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  public user_data: any = [];
  public id: any = 0;

  public get_user_profile() {
    const payload = {
      user_id: parseInt(this.id),
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
  public formatToThaiMonthDay(dateStr: string) {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }
  ngOnInit(): void {
    this.id = this.authen.getUserId();
    this.get_user_profile();
  }

  ngOnDestroy(): void {
    // Add cleanup logic here
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('ProfileComponent destroyed');
  }
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
