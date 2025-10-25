import { Component, inject } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';

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

  private authen = inject(AuthenticationServiceService);

  private restApi = new RestApiService();
  private unsubscribe$ = new Subject<void>();
  public state = 'Friend Requests';

  private setPayload() {
    const id = this.authen.getUserId();
    return {
      user_id: id,
    };
  }
  public getFriendRequests() {
    const id = this.setPayload();

    this.restApi
      .post('friends/list_friend/', id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.Friend_Request_Data = response.message;
        console.log('Friend Requests Data:', this.Friend_Request_Data);
      });
  }

  onChoiceChanged(newChoice: string) {
    this.state = newChoice;
    console.log('New choice:', newChoice);
  }

  ngOnInit(): void {
    const id = this.authen.getUserId();
    console.log('User ID:', id);
    this.getFriendRequests();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
