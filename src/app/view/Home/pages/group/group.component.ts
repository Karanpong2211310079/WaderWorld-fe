import { Component } from '@angular/core';

@Component({
  selector: 'app-group',
  imports: [],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  condition = 1

  changeStateIndex(i:number){
    this.condition = i
  }
}
