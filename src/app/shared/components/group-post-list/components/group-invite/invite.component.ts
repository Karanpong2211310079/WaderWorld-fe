import { Component, inject, Inject } from '@angular/core';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invite',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss',
})
export class InviteComponent implements OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  private modalService = inject(NgModalServiceService);
  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef, // modal reference
    @Inject('value') public value: any
  ) {}

  public Friends: any[] = [];

  public loadFriends() {
    const user_id = {
      user_id: this.authen.getUserId(),
    };
    this.restapi
      .post('friends/list_friend/', user_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.Friends = response?.message || [];
          console.log('📂 Friends List:', this.Friends);
        },
        error: (err) => console.error('❌ Load friends error:', err),
      });
  }
  public inviteFriend(friend: any) {
    // อัพเดต UI ก่อน
    friend.invited = true;

    // สร้าง payload ใช้ value ที่ส่งมาจาก modal (group_id)
    const payload = {
      group_id: this.value.value, // group_id จาก modal
      inviter_id: this.authen.getUserId(), // id ของคนเชิญ
      new_member: friend.friend_info.id, // id ของเพื่อนที่จะ invite
    };

    console.log('Inviting Friend with payload:', payload);

    this.restapi
      .post('group/create_group_invite/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Invite sent:', res);
        },
        error: (err) => {
          console.error('❌ Invite error:', err);
          // ถ้า invite ล้มเหลว กลับสถานะ invited
          friend.invited = false;
        },
      });
  }
  public closeModal() {
    this.modalService.dismissModal(this.modalEl, 'cancle');
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    console.log(this.value);
    this.loadFriends();
  }
}
