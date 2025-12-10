import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { CreateUserPostComponent } from '../../../../shared/components/create-user-post/create-user-post.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserPostComponent } from '../../../../shared/components/user-post/user-post.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [
    FollowBtnComponent,
    CreateUserPostComponent,
    CommonModule,
    UserPostComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();
  private router = inject(Router);
  public choice: string = 'Discover'; // <-- ตั้งค่าเริ่มต้นเป็น Discover
  public user_posts: any[] = [];
  public filtered_posts: any[] = [];
  public state: string = 'For You';
  public Allgroups: any[] = [];
  public new_groups: any[] = []; // สำหรับแนะนำกลุ่มใหม่
  // home.component.ts
  // ในไฟล์ component.ts ของคุณ

  public categories = [
    { name: 'BEACH', label: 'Sea & Islands', color: '#0dcaf0', icon: '🏖️' }, // bg-info
    {
      name: 'MOUNTAIN',
      label: 'Mountains & Hills',
      color: '#198754',
      icon: '⛰️',
    }, // bg-success
    { name: 'FOREST', label: 'Forest', color: '#212529', icon: '🌳' }, // bg-dark
    {
      name: 'TOURIST_SPOT',
      label: 'Tourist Spots',
      color: '#ffc107',
      icon: '📍',
    }, // bg-warning

    { name: 'CAMPING', label: 'Camping', color: '#6c757d', icon: '🏕️' }, // bg-secondary
    {
      name: 'TEMPLE_MERIT',
      label: 'Temples & Merit Making',
      color: '#0d6efd',
      icon: '🛕',
    }, // bg-primary
    { name: 'FOOD_CAFE', label: 'Food & Cafes', color: '#dc3545', icon: '☕' }, // bg-danger
    {
      name: 'THEME_WATER_PARK',
      label: 'Theme & Water Parks',
      color: '#0dcaf0',
      icon: '🎢',
    }, // bg-info
    {
      name: 'ADVENTURE',
      label: 'Hiking & Adventure',
      color: '#198754',
      icon: '🧗',
    }, // bg-success
    {
      name: 'NIGHTLIFE',
      label: 'Nightlife & Party',
      color: '#212529',
      icon: '🍻',
    }, // bg-dark
    {
      name: 'VOLUNTEERING',
      label: 'Volunteering',
      color: '#0d6efd',
      icon: '🤝',
    }, // bg-primary
    { name: 'PHOTOGRAPHY', label: 'Photography', color: '#6c757d', icon: '📸' }, // bg-secondary
    { name: 'CONCERT', label: 'Concerts', color: '#dc3545', icon: '🎤' }, // bg-danger
    {
      name: 'WATERFALL',
      label: 'Waterfalls & Nature',
      color: '#0dcaf0',
      icon: '🏞️',
    }, // bg-info
    {
      name: 'CITY_TRIP',
      label: 'City Sightseeing',
      color: '#ffc107',
      icon: '🏙️',
    }, // bg-warning
    { name: 'DIVING', label: 'Diving', color: '#0d6efd', icon: '🤿' }, // bg-primary
    { name: 'OTHER', label: 'Other', color: '#6c757d', icon: '❓' }, // bg-secondary
  ];
  public selectedCategory: string = '';

  public selected_category: string | null = null;

  ngOnInit(): void {
    this.loadPosts(); // โหลดโพสต์
    this.LoadAllGroup(); // โหลดกลุ่ม
  }
  goToGroup(groupId: number) {
    this.router.navigate([`/workspace/group/${groupId}`], {
      queryParams: { id: groupId, choice: 'Discover' },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public LoadAllGroup() {
    const user_id = { user_id: this.authen.getUserId() };
    this.restapi
      .post('group/get_groups/', user_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.Allgroups = response?.all_groups || [];
          console.log('📂 All Groups:', this.Allgroups);

          // เลือกกลุ่มใหม่ is_new = true สูงสุด 3
          this.new_groups = this.Allgroups.filter((g) => g.is_new).slice(0, 3);
        },
        error: (err) => console.error('❌ Load group error:', err),
      });
  }

  // โหลดโพสต์ตาม state
  loadPosts() {
    const userId = this.authen.getUserId();

    if (this.state === 'Following') {
      // API Following
      const payload = { user_id: userId, visibility: 'PUBLIC' };
      this.restapi
        .post('home/get_post_friends/', payload)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          this.user_posts = res.message;
          this.filtered_posts = this.user_posts;
        });
    } else {
      // API For You (category)
      const payload = { category: this.selected_category || null };
      this.restapi
        .post('home/get_post_catagory/', payload)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          this.user_posts = res.message;
          this.applyFilters();
        });
    }
  }

  // filter สำหรับ For You
  applyFilters() {
    if (this.state === 'For You' && this.selected_category) {
      this.filtered_posts = this.user_posts.filter(
        (post) => post.category === this.selected_category
      );
    } else {
      this.filtered_posts = this.user_posts;
    }
  }

  // home.component.ts
  filterByCategory(catName: string) {
    this.selectedCategory = catName;
    // ทำ filter โพสต์ที่นี่
    this.filtered_posts = this.user_posts.filter(
      (p: any) => catName === 'OTHER' || p.category === catName
    );
  }

  onChoiceChanged(newChoice: string) {
    this.state = newChoice;
    this.selected_category = null; // reset category
    this.loadPosts();
  }

  handlePostUpdated(event: any) {
    console.log('Post updated:', event);
    this.loadPosts();
  }
}
