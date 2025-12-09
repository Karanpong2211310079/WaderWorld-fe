import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { Subject, takeUntil } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { CreatePostComponent } from '../create-group-post/create-post.component';
import { CommonModule } from '@angular/common';
import { NgModalServiceService } from '../../../core/service/ng-modal-service/ng-modal-service.service';
import { InviteComponent } from './components/group-invite/invite.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../core/service/toast-service/toast.service';
import { Router } from '@angular/router';
import { PeopleComponent } from './components/group-people/people.component';
@Component({
  selector: 'app-group-post-list',
  imports: [
    PostComponent,
    CreatePostComponent,
    CommonModule,
    NgbDropdownModule,
  ],
  templateUrl: './group-post-list.component.html',
  styleUrl: './group-post-list.component.scss',
})
export class GroupPostListComponent implements OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  private modalService = inject(NgModalServiceService);
  private toast = inject(ToastService);
  private router = inject(Router);
  public is_admin_group: boolean = false;
  public is_member: boolean = false;
  public type: string = 'group';

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkType(event: any): string {
    if (event === 'PUBLIC') {
      return 'Public';
    } else {
      return 'Private';
    }
  }

  public group_data: any = [];

  ngOnInit(): void {
    this.LoadGroupData();
    this.check_role_group();
    this.check_user_in_group();
  }
  public check_user_in_group() {
    // ดึง param จาก URL (string)
    const group_id_str = this.route.snapshot.paramMap.get('id');

    // แปลงเป็น number
    const group_id = group_id_str ? parseInt(group_id_str, 10) : null;

    // user_id จาก service ของคุณ (number | null)
    const user_id = this.authen.getUserId();

    // ตรวจสอบค่าที่ไม่ถูกต้อง
    if (group_id === null || user_id === null) {
      console.error('Invalid group_id or user_id:', group_id, user_id);
      return;
    }

    // payload ทั้งคู่เป็น number
    const Payload = {
      group_id: group_id,
      user_id: user_id,
    };

    console.log('Payload for checking user in group:', Payload);
    // { group_id: 3, user_id: 3 } ✅

    this.restapi
      .post('group/check_user_in_group/', Payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.is_member = response.in_group;
          console.log('member', this.is_member);
        },
        error: (err) => this.toast.error('Error checking membership'),
      });
  }

  public RequestJoined(event: Event, groupId: number) {
    const payload = {
      user_id: this.authen.getUserId(),
      group_id: groupId,
    };
    this.restapi
      .post('group/create_request_join/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log('✅ Join request sent:', response);
          // รีโหลดหน้าใหม่
          window.location.reload();
        },
        error: (err) => console.error('❌ Join request error:', err),
      });
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
  public LoadGroupData() {
    const group_id = {
      group_id: this.route.snapshot.paramMap.get('id'),
    };
    this.restapi
      .post('group/get_group_data/', group_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.group_data = response?.message || [];
        },
        error: (err) => console.error('❌ Load group posts error:', err),
      });
  }
  public Leave_group() {
    const payload = {
      group_id: this.route.snapshot.paramMap.get('id'),
      user_id: this.authen.getUserId(),
    };
    this.restapi
      .post('group/LeaveGroup/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/workspace/group']);
          this.toast.success('Left group successfully');
        },
        error: (err) => this.toast.error('failed to leave group'),
      });
  }
  public invite_people() {
    const group_id = this.route.snapshot.paramMap.get('id');

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
        componentRef: InviteComponent,
        value: group_id,
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }

  public check_role_group() {
    const group_id = this.route.snapshot.paramMap.get('id');
    const user_id = this.authen.getUserId();

    const Payload = {
      group_id: group_id,
      user_id: user_id,
    };

    this.restapi
      .post('group/check_user_role/', Payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          const role = response.role;
          if (role == 'ADMIN') {
            this.is_admin_group = true;
          } else {
            this.is_admin_group = false;
          }
          console.log(this.is_admin_group);
        },
      });
  }

  public PeopleGroup() {
    const group_id = this.route.snapshot.paramMap.get('id');

    this.modalService.openTemplateModal(
      'Create Group',
      {
        autoCloseRoutingChange: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: false,
      },
      {
        componentRef: PeopleComponent,
        value: {
          group_id: group_id,
          members: this.group_data.members,
        },
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public onPostUpdated(updatedPost: any) {
    this.LoadGroupData();
  }
}
