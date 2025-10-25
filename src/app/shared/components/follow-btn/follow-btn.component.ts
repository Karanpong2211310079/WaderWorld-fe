import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss'],
})
export class FollowBtnComponent {
  @Input() choice1!: string;
  @Input() choice2!: string;
  @Output() choiceChange = new EventEmitter<string>();

  currentChoice!: string;

  ngOnInit() {
    this.currentChoice = this.choice1;
  }

  selectChoice(choice: string) {
    if (this.currentChoice !== choice) {
      this.currentChoice = choice;
      this.choiceChange.emit(this.currentChoice);
    }
  }
}
