import { Component } from '@angular/core';
import { TopbarComponent } from '../Home/components/topbar/topbar.component';
import { AdminBarComponent } from "./pages/components/admin-bar/admin-bar.component";
import { RouterOutlet } from '@angular/router';
import { VerticalComponent } from "./pages/components/vertical/vertical.component";
@Component({
  selector: 'app-admin',
  imports: [TopbarComponent, AdminBarComponent, RouterOutlet, VerticalComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
