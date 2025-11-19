import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-airline',
  imports: [CommonModule],
  templateUrl: './airline.component.html',
  styleUrl: './airline.component.scss',
})
export class AirlineComponent {
  airlines = [
    {
      name: 'Thai Airways',
      description: 'Thailand national airline',
      image: 'assets/images/1.png',
      link: 'https://www.thaiairways.com',
    },
    {
      name: 'Singapore Airlines',
      description: 'Singapore luxury airline',
      image: 'assets/images/2.png',
      link: 'https://www.singaporeair.com',
    },
    {
      name: 'Qatar Airways',
      description: 'Premium airline from Qatar',
      image: 'assets/images/3.png',
      link: 'https://www.qatarairways.com',
    },
    {
      name: 'Emirates',
      description: 'Airline from UAE',
      image: 'assets/images/4.png',
      link: 'https://www.emirates.com',
    },
    {
      name: 'Cathay Pacific',
      description: 'Hong Kong airline',
      image: 'assets/images/5.png',
      link: 'https://www.cathaypacific.com',
    },
    {
      name: 'Lufthansa',
      description: 'German airline',
      image: 'assets/images/6.png',
      link: 'https://www.lufthansa.com',
    },
    {
      name: 'Air France',
      description: 'French airline',
      image: 'assets/images/7.png',
      link: 'https://www.airfrance.com',
    },
    {
      name: 'British Airways',
      description: 'UK airline',
      image: 'assets/images/8.png',
      link: 'https://www.britishairways.com',
    },
    {
      name: 'Delta Airlines',
      description: 'USA airline',
      image: 'assets/images/9.png',
      link: 'https://www.delta.com',
    },
  ];
}
