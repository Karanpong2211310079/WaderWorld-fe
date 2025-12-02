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
      .post('home/user_recommend/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          // เพิ่ม isRequested ให้แต่ละ user เริ่มต้นเป็น false
          this.recommendedUsers = (res.message || []).map((user: any) => ({
            ...user,
            isRequested: false,
          }));
        },
        error: (err) => console.error('❌ Load recommended users error:', err),
      });
  }

  followUser(user: any) {
    user.isRequested = true; // เปลี่ยนสถานะทันทีใน UI

    const payload = {
      user_id: this.authen.getUserId(),
      friend_id: user.id,
    };

    console.log('Follow payload:', payload);

    this.restapi
      .post('friends/add/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => console.log('✅ Followed user:', user.id),
        error: (err) => {
          console.error('❌ Follow user error:', err);
          user.isRequested = false; // ถ้าผิดพลาดกลับสถานะ
        },
      });
  }
}
