import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { Subject, takeUntil } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-group-post-list',
  imports: [PostComponent, CreatePostComponent, CommonModule],
  templateUrl: './group-post-list.component.html',
  styleUrl: './group-post-list.component.scss',
})
export class GroupPostListComponent implements OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  public group_data: any = [];

  ngOnInit(): void {
    this.LoadGroupData();
  }
  ngOnDestroy(): void {}

  public LoadGroupData() {
    const group_id = {
      group_id: this.route.snapshot.paramMap.get('id'),
    };
    this.restapi
      .post('group/get_group_data/', group_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.group_data = response?.message || [];
          console.log('📂 Group Posts:', this.group_data);
        },
        error: (err) => console.error('❌ Load group posts error:', err),
      });
  }
}
