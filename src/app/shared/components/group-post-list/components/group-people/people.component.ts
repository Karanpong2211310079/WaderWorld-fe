import { Component, OnDestroy, OnInit, inject, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { Subject, takeUntil } from 'rxjs';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-people',
  imports: [CommonModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  private modalService = inject(NgModalServiceService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public members: any[] = []; // สมาชิกทั้งหมด
  public group_id: any;
  public: any[] = [];

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef, // modal reference
    @Inject('value') public value: any // รับข้อมูล group จาก parent
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  get approvedMembers() {
    return this.members.filter((m) => m.status === 'APPROVED');
  }
  get pendingMembers() {
    return this.members.filter((m) => m.status === 'PENDING');
  }

  ngOnInit(): void {
    console.log('Group data:', this.value.value);
    this.group_id = this.value.value.group_id;
    this.members = this.value.value.members || [];
  }

  public approveMember(member: number) {
    const payload = {
      user_id: member,
      group_id: this.group_id,
    };

    this.restapi
      .post('group/group_approve/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.toast.success('Member approved');
        },
        error: (err) => this.toast.error('Error approving member'),
      });
  }

  public rejectMember(member: number) {
    const payload = {
      user_id: member,
      group_id: this.group_id,
    };

    this.restapi
      .post('group/group_reject/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.toast.success('Member rejected');
        },
        error: (err) => this.toast.error('Error rejecting member'),
      });
  }

  public cancelMember(member: number) {
    const payload = {
      user_id: member,
      group_id: this.group_id,
    };

    this.restapi
      .post('group/group_cancle/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.toast.success('Membership cancelled');
        },
        error: (err) => this.toast.error('Error cancelling membership'),
      });
  }
  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
}
