import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { PostDataModalComponent } from '../components/post-data-modal/post-data-modal.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-manage-group',
  imports: [CommonModule],
  templateUrl: './manage-group.component.html',
  styleUrl: './manage-group.component.scss',
})
export class ManageGroupComponent implements OnDestroy, OnInit {
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);
  private authen = inject(AuthenticationServiceService);

  private restApi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();

  public Group_Data: any;

  public getAllGroup() {
    this.restApi
      .get('admin/get_groups/')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.Group_Data = response.message;
        console.log('data', this.Group_Data);
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

  ngOnInit(): void {
    this.getAllGroup();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
