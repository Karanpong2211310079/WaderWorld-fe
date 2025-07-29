import { Component } from '@angular/core';
import { TopbarComponent } from "./components/topbar/topbar.component";
import { SidebarLeftComponent } from "./components/sidebar-left/sidebar-left.component";
import { FeedContentComponent } from "./components/feed-content/feed-content.component";
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SidebarRightComponent } from "./components/sidebar-right/sidebar-right.component"; 
@Component({
  selector: 'app-workspace',
  imports: [TopbarComponent, SidebarLeftComponent, RouterModule, RouterOutlet, SidebarRightComponent, FeedContentComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {

}
