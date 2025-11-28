import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-airline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss'],
})
export class AirlineComponent {
  airlines = [
    {
      name: 'Thai Airways',
      description: 'Thailand national airline',
      image: 'assets/images/1.png',
      link: 'https://www.thaiairways.com/en-th/',
    },
  ];
}
