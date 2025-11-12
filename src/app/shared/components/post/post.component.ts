import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RestApiService } from '../../../core/service/rest-api-service/rest-api.service';
import { ToastService } from '../../../core/service/toast-service/toast.service';
import { AuthenticationServiceService } from '../../../core/service/authentication-service/authentication-service.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-post',
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnDestroy, OnInit {
  private restapi = inject(RestApiService);
  private toast = inject(ToastService);
  private authen = inject(AuthenticationServiceService);
  @Input() group_post: any; // ไม่ใช่ any[]

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    console.log(this.group_post);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  likesCount = 0;
  commentsCount = 0;

  onLike() {
    this.likesCount++;
    console.log('Liked post', this.group_post.id);
  }

  onComment() {
    console.log('Comment clicked for post', this.group_post.id);
  }

  onShare() {
    console.log('Share clicked for post', this.group_post.id);
  }
}
