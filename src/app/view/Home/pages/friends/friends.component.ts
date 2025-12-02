import { Component, inject } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-friends',
  imports: [FollowBtnComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit, OnDestroy {
  public Friend_Requests: string = 'Friend Requests';
  public Friend: string = 'Friend';
  public Friend_Request_Data: any[] = [];
  public AllFriends: any[] = [];

  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);
  private authen = inject(AuthenticationServiceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private restApi = new RestApiService();
  private unsubscribe$ = new Subject<void>();
  public state = 'Friend Requests';
  public is_friend: boolean = false;

  private setIdPayload() {
    const id = this.authen.getUserId();
    return {
      user_id: id,
    };
  }
  private setPayload(friendId: number) {
    const id = this.authen.getUserId();
    return {
      friend_id: friendId,
      user_id: id,
    };
  }
  public goToMessage(friendId: number) {
    const payload = {
      user_ids: [this.authen.getUserId(), friendId],
      chatroom_type: 'PRIVATE',
    };

    this.restApi
      .post('message/create_chatroom/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          // backend ต้อง return chatroom_id ไม่ว่าจะสร้างใหม่หรือมีอยู่แล้ว
          const chatroomId = response.chatroom_id;
          console.log('Chatroom ID:', chatroomId);

          // ไปหน้า message component และเลือก chatroom
          this.router.navigate(['/workspace/message'], {
            queryParams: { chatroom_id: chatroomId },
          });
        },
        error: (err) => console.error('Error creating/getting chatroom:', err),
      });
  }

  public getFriendRequests() {
    const id = this.setIdPayload();
    console.log('Payload for Friend Requests:', id);

    this.restApi
      .post('friends/list_friend_request/', id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.Friend_Request_Data = response.message;
        console.log('Friend Requests Data:', this.Friend_Request_Data);
      });
  }
  public getFriends() {
    const id = this.setIdPayload();
    this.restApi
      .post('friends/list_friend/', id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response.status === 'success') {
          this.AllFriends = response.message;
          console.log('All Friends Data:', this.AllFriends);
        }
      });
  }

  public onDelete(friendId: number) {
    const payload = this.setPayload(friendId);
    console.log(payload);
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this friend?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.restApi
          .post('friends/decline/', payload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((response) => {
            console.log(response);
            if (response.status === 'success') {
              Swal.fire('Deleted!', 'Deleted friend successfully', 'success');
              this.getFriendRequests();
              this.getFriends();
            } else {
              Swal.fire('Error!', 'Failed to delete friend', 'error');
            }
          });
      }
    });
  }

  public onConfirm(friendId: number) {
    const payload = this.setPayload(friendId);
    console.log(payload);
    this.restApi
      .post('friends/accept/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response.status === 'success') {
          this.toast.success('Accepted friend request successfully');
          this.getFriendRequests();
          this.getFriends();
        } else {
          this.toast.error('Failed to accept friend request');
        }
      });
  }

  onChoiceChanged(newChoice: string) {
    this.state = newChoice;
  }

  ngOnInit(): void {
    const id = this.authen.getUserId();
    this.getFriends();
    this.getFriendRequests();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}