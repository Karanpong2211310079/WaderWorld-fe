import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { FeedContentComponent } from './components/feed-content/feed-content.component';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';

@Component({
  selector: 'app-workspace',
  imports: [
    TopbarComponent,
    SidebarLeftComponent,
    RouterModule,
    RouterOutlet,
    SidebarRightComponent,
    CommonModule,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit {
  loading: boolean = true;

  ngOnInit() {
    // Simulate loading delay
    setTimeout(() => {
      this.loading = false; // Set loading to false after 2 seconds
    }, 2000); // Adjust the time as needed
  }
}
