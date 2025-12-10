import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CreatePostComponent } from '../../../../shared/components/create-group-post/create-post.component';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeopleGroupComponent } from './components/people-group/people-group.component';
import { OrderByIdDescPipe } from '../../../../shared/pipe/order-by-id-desc.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group',
  imports: [
    CreatePostComponent,
    CommonModule,
    FollowBtnComponent,
    OrderByIdDescPipe,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private modalService = inject(NgModalServiceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private unsubscribe$ = new Subject<void>();
  public choice = 'Your Groups';

  public Usergroups: any[] = [];
  public Allgroups: any[] = [];

  ngOnInit(): void {
    this.LoadAllGroup();
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
          this.Usergroups = response?.user_groups || [];
          this.Allgroups = response?.all_groups || [];
          console.log('📂 User Groups:', this.Usergroups);
          console.log('📂 All Groups:', this.Allgroups);
        },
        error: (err) => console.error('❌ Load group error:', err),
      });
  }

  public openCreateGroup() {
    this.modalService.openTemplateModal(
      'Create Group',
      {
        autoCloseRoutingChange: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: false,
      },
      {
        componentRef: CreateGroupComponent,
        value: '',
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public PeopleGroup() {
    this.modalService.openTemplateModal(
      'Create Group',
      {
        autoCloseRoutingChange: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: false,
      },
      {
        componentRef: PeopleGroupComponent,
        value: '',
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public NavigateToGroup(event: Event, groupId: number) {
    event.preventDefault();
    this.router.navigate(['/workspace/group', groupId]);
  }
  public RequestJoined(event: Event, groupId: number) {
    const payload = {
      user_id: this.authen.getUserId(),
      group_id: groupId,
    };
    this.restapi
      .post('group/create_request_join/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log('✅ Join request sent:', response);
          this.LoadAllGroup();
        },
        error: (err) => console.error('❌ Join request error:', err),
      });
  }
  checkType(event: any): string {
    if (event === 'PUBLIC') {
      return 'Public';
    } else {
      return 'Private';
    }
  }

  public onChoiceChange(choice: string) {
    this.choice = choice;
    console.log('🔄 Choice changed to:', this.choice);
  }
  // Method สำหรับกำหนด CSS class ของ badge
  getCategoryBadgeClass(category: string): string {
    const categoryClasses: { [key: string]: string } = {
      BEACH: 'bg-info text-white',
      MOUNTAIN: 'bg-success text-white',
      FOREST: 'bg-dark text-white',
      TOURIST_SPOT: 'bg-warning text-dark',
      CAMPING: 'bg-secondary text-white',
      TEMPLE_MERIT: 'bg-primary text-white',
      FOOD_CAFE: 'bg-danger text-white',
      THEME_WATER_PARK: 'bg-info text-white',
      ADVENTURE: 'bg-success text-white',
      NIGHTLIFE: 'bg-dark text-white',
      VOLUNTEERING: 'bg-primary text-white',
      PHOTOGRAPHY: 'bg-secondary text-white',
      CONCERT: 'bg-danger text-white',
      WATERFALL: 'bg-info text-white',
      CITY_TRIP: 'bg-warning text-dark',
      DIVING: 'bg-primary text-white',
      OTHER: 'bg-secondary text-white',
    };

    return categoryClasses[category] || 'bg-secondary text-white';
  }

  // Method สำหรับแสดงชื่อหมวดหมู่
  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      BEACH: '🏖️ Sea & Islands',
      MOUNTAIN: '⛰️ Mountains & Hills',
      FOREST: '🌳 Forest',
      TOURIST_SPOT: '📍 Tourist Spots',
      CAMPING: '🏕️ Camping',
      TEMPLE_MERIT: '🛕 Temples & Merit Making',
      FOOD_CAFE: '☕ Food & Cafes',
      THEME_WATER_PARK: '🎢 Theme & Water Parks',
      ADVENTURE: '🧗 Hiking & Adventure',
      NIGHTLIFE: '🍻 Nightlife & Party',
      VOLUNTEERING: '🤝 Volunteering',
      PHOTOGRAPHY: '📸 Photography',
      CONCERT: '🎤 Concerts',
      WATERFALL: '🏞️ Waterfalls & Nature',
      CITY_TRIP: '🏙️ City Sightseeing',
      DIVING: '🤿 Diving',
      OTHER: '❓ Other',
    };

    return categoryNames[category] || category;
  }
}
