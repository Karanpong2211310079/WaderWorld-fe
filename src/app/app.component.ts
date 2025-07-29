import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './view/account/register/register.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WaderWorld-fe';
}
