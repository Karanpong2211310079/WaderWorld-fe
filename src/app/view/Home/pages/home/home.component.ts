import { Component } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { CreateUserPostComponent } from '../../../../shared/components/create-user-post/create-user-post.component';
@Component({
  selector: 'app-home',
  imports: [FollowBtnComponent, CreateUserPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  condition = 1;

  changeStateIndex(i: number) {
    this.condition = i;
  }
}
