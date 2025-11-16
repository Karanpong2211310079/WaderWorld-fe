import { Component, inject, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
@Component({
  selector: 'app-post-data-modal',
  imports: [],
  templateUrl: './post-data-modal.component.html',
  styleUrl: './post-data-modal.component.scss',
})
export class PostDataModalComponent implements OnDestroy, OnInit {
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);
  private authen = inject(AuthenticationServiceService);
  private restApi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();

  public post: any;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any
  ) {}

  private setStateDataFunction() {
    const userId = this.value.value.user_data;
    const groupId = this.value.value.group_data;

    if (userId) {
      this.post = userId;
      console.log('Modal opened for USER POST, user_id =', this.post);
    }

    if (groupId) {
      this.post = groupId;
      console.log('Modal opened for GROUP POST, group_id =', this.post);
    }
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
  public CancleCreateGroup() {
    this.modalService.dismissModal(this.modalEl, 'save');
  }

  ngOnInit(): void {
    this.setStateDataFunction();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
