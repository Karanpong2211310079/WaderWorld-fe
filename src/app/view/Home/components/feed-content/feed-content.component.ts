import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-feed-content',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.scss'
})
export class FeedContentComponent {

}
