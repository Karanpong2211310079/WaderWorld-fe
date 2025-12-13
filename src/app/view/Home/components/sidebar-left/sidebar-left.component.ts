import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-left',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.scss',
})
export class SidebarLeftComponent {
  activeIndex = 0;

  setActive(index: number) {
    this.activeIndex = index;
  }
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  closeSidebarOnMobile() {
    // Close sidebar only on mobile when menu item is clicked
    if (window.innerWidth < 992) {
      this.isSidebarOpen = false;
    }
  }
}
