import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CreatePostComponent } from '../../../../shared/components/create-group-post/create-post.component';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group',
  imports: [CreatePostComponent, CommonModule, FollowBtnComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private modalService = inject(NgModalServiceService);
  private router = inject(Router);

  private unsubscribe$ = new Subject<void>();
  public choice = 'Your Groups';

  public Usergroups: any[] = [];
  public Allgroups: any[] = [];

  ngOnInit(): void {
    this.LoadYourGroup();
    this.LoadAllGroup();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public LoadYourGroup() {
    const user_id = {
      user_id: this.authen.getUserId(),
    };
    this.restapi
      .post('group/get_user_groups/', user_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.Usergroups = response?.message || [];
          console.log('📂 User Groups:', this.Usergroups);
        },
        error: (err) => console.error('❌ Load group error:', err),
      });
  }
  public LoadAllGroup() {
    const user_id = {
      user_id: this.authen.getUserId(),
    };
    this.restapi
      .post('group/get_groups/', user_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.Allgroups = response?.message || [];
          console.log('📂 User Groups:', this.Allgroups);
        },
        error: (err) => console.error('❌ Load group error:', err),
      });
  }

  public openCreateGroup() {
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
        componentRef: CreateGroupComponent,
        value: '',
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public NavigateToGroup(event: Event, groupId: number) {
    event.preventDefault();
    this.router.navigate(['/workspace/group', groupId]);
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
          this.LoadAllGroup();
        },
        error: (err) => console.error('❌ Join request error:', err),
      });
  }

  public onChoiceChange(choice: string) {
    this.choice = choice;
    console.log('🔄 Choice changed to:', this.choice);
  }
}
