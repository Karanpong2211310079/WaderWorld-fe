import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-left',
  imports: [RouterModule],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.scss'
})
export class SidebarLeftComponent  {
   activeIndex = 0;

  setActive(index: number) {
    this.activeIndex = index;
  }

}
