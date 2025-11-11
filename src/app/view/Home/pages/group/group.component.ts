import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CreatePostComponent } from '../../../../shared/components/create-post/create-post.component';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { Subject } from 'rxjs';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
@Component({
  selector: 'app-group',
  imports: [CreatePostComponent, FollowBtnComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  condition = 1;

  changeStateIndex(i: number) {
    this.condition = i;
  }
}
