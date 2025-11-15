import { Component } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
@Component({
  selector: 'app-manage-post',
  imports: [FollowBtnComponent],
  templateUrl: './manage-post.component.html',
  styleUrl: './manage-post.component.scss',
})
export class ManagePostComponent {
  public state: string = 'User';
  public User_state: string = 'User';
  public Group_state: string = 'Group';

  onChoiceChanged(newChoice: string) {
    this.state = newChoice;
  }
}
