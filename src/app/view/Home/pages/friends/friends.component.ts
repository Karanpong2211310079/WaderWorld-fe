import { Component, inject } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
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

  private restApi = new RestApiService();
  private unsubscribe$ = new Subject<void>();
  public state = 'Friend Requests';

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

    this.modalService
      .openConfirm(
        'Confirm Deletion',
        'Are you sure you want to delete this friend?',
        'Yes, Delete',
        'Cancel'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.restApi
            .post('friends/decline/', payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response) => {
              if (response.status === 'success') {
                this.toast.success('Deleted friend successfully');
                this.getFriends();
              } else {
                this.toast.error('Failed to delete friend');
              }
            });
        }
      });
  }

  public onConfirm(friendId: number) {
    const payload = this.setPayload(friendId);
    this.restApi
      .post('friends/accept/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response.status === 'success') {
          this.toast.success('Accepted friend request successfully');
          this.getFriendRequests();
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
