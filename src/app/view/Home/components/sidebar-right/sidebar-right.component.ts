import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-right',
  imports: [CommonModule],
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit, OnDestroy {
  private restapi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();
  private authen = inject(AuthenticationServiceService);

  public recommendedUsers: any[] = [];

  ngOnInit(): void {
    this.loadRecommendedUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadRecommendedUsers() {
    const payload = {
      user_id: this.authen.getUserId(),
    };
    this.restapi
      .post('home/user_recommend/', payload) // เรียก API
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.recommendedUsers = res.message || []; // สมมติ response มี field 'users'
        },
        error: (err) => console.error('❌ Load recommended users error:', err),
      });
  }

  followUser(userId: number) {
    // ตัวอย่างเรียก API follow user
    this.restapi
      .post('follow_user/', { user_id: userId })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => console.log('✅ Followed user:', userId),
        error: (err) => console.error('❌ Follow user error:', err),
      });
  }
}
