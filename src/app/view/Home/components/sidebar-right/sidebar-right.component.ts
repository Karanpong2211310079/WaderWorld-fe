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
  public itemsToShow = 3;

  showMore() {
    this.itemsToShow += 3;
  }

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
          const users = Array.isArray(res?.message) ? res.message : [];
          console.log('✅ Loaded recommended users:', users);
          this.recommendedUsers = users.map((user: any) => ({
            ...user,
            image_url: user.image_url || 'https://via.placeholder.com/40',
            followerCount: user.followerCount || 0,
            isRequested: false,
          }));
        },
        error: (err) => console.error('❌ Load recommended users error:', err),
      });
  }

  getRankLabel(rank: number): string {
    switch (rank) {
      case 1:
        return 'RANK #1';
      case 2:
        return 'RANK #2';
      case 3:
        return 'RANK #3';
      case 4:
        return 'RANK #4';
      case 5:
        return 'RANK #5';
      default:
        return `RANK #${rank}`;
    }
  }

  formatFollowerCount(count: number): string {
    if (!count) return '0';

    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1) + 'K';
    return count.toString();
  }

  followUser(user: any) {
    if (user.isRequested) return;

    user.isRequested = true;

    const payload = {
      user_id: this.authen.getUserId(),
      friend_id: user.id,
    };

    this.restapi
      .post('friends/add/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log('✅ Followed user:', user.id);
        },
        error: (err) => {
          console.error('❌ Follow user error:', err);
          user.isRequested = false;
        },
      });
  }
  onImageError(event: any) {
    // ซ่อนรูปภาพที่โหลดไม่ได้และแสดง default avatar แทน
    event.target.style.display = 'none';
    const defaultAvatar = event.target.nextElementSibling;
    if (defaultAvatar) {
      defaultAvatar.style.display = 'flex';
    }
  }
}
