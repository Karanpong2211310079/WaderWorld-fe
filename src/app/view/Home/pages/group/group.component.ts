import { Component } from '@angular/core';
import { CreatePostComponent } from "../../../../shared/components/create-post/create-post.component";
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
@Component({
  selector: 'app-group',
  imports: [CreatePostComponent,FollowBtnComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  condition = 1

  changeStateIndex(i:number){
    this.condition = i
  }
}
