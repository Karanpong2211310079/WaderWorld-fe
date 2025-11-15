import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { Subject, takeUntil } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { CommonModule } from '@angular/common';
import { NgModalServiceService } from '../../../core/service/ng-modal-service/ng-modal-service.service';
import { InviteComponent } from './components/group-invite/invite.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../core/service/toast-service/toast.service';
import { Router } from '@angular/router';
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public group_data: any = [];

  ngOnInit(): void {
    this.LoadGroupData();
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
          console.log('📂 Group Posts:', this.group_data);
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
          this.toast.success('failed to leave group');
        },
        error: (err) => this.toast.error(''),
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
  public onPostUpdated(updatedPost: any) {
    this.LoadGroupData();
  }
}
