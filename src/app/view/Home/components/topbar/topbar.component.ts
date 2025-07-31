import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router, RouterOutlet } from '@angular/router'; // <== เพิ่มตรงนี้

@Component({
  selector: 'app-topbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
private router = inject(Router)
isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }



}
