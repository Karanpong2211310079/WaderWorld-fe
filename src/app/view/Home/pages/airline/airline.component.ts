import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface Airline {
  id: string;
  name: string;
  description: string;
  link: string;
  image: string;
  rating: number;
  features: string[];
}
@Component({
  selector: 'app-airline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss'],
})
export class AirlineComponent {
  airlines: Airline[] = [
    {
      id: '1',
      name: 'Thai Airways',
      description:
        "Thailand's flagship carrier offering premium service and extensive domestic and international routes with world-class hospitality.",
      link: 'https://www.thaiairways.com',
      image:
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&h=467&fit=crop',
      rating: 4.5,
      features: ['Premium Service', 'International', 'Royal Orchid Plus'],
    },
    {
      id: '2',
      name: 'Bangkok Airways',
      description:
        "Asia's boutique airline providing personalized service to unique destinations across Thailand and Southeast Asia.",
      link: 'https://www.bangkokair.com',
      image:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=467&fit=crop',
      rating: 4.2,
      features: ['Boutique Service', 'Island Destinations', 'FlyerBonus'],
    },
    {
      id: '3',
      name: 'Thai Lion Air',
      description:
        'Low-cost carrier offering affordable flights across Thailand and Southeast Asia with modern fleet and reliable service.',
      link: 'https://www.lionairthai.com',
      image:
        'https://pbs.twimg.com/profile_images/924843000601067520/VoX5TU9w_400x400.jpg',
      rating: 3.8,
      features: ['Low Cost', 'Modern Fleet', 'Domestic Routes'],
    },
    {
      id: '4',
      name: 'Nok Air',
      description:
        "Thailand's colorful low-cost airline connecting major cities with friendly service and competitive prices.",
      link: 'https://www.nokair.com',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&h=467&fit=crop',
      rating: 3.9,
      features: ['Colorful Brand', 'Affordable', 'Smile Service'],
    },
    {
      id: '5',
      name: 'Thai AirAsia',
      description:
        'Leading low-cost carrier in Asia offering budget-friendly flights with excellent punctuality and digital services.',
      link: 'https://www.airasia.com',
      image:
        'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=700&h=467&fit=crop',
      rating: 4.0,
      features: ['Low Cost Leader', 'Digital First', 'AirAsia BIG'],
    },
    {
      id: '6',
      name: 'Thai Vietjet',
      description:
        'New-age airline offering ultra-low-cost flights with modern aircraft and innovative services across the region.',
      link: 'https://www.vietjetair.com',
      image:
        'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=700&h=467&fit=crop',
      rating: 3.7,
      features: ['Ultra Low Cost', 'New Generation', 'SkyJoy'],
    },
  ];

  // ฟังก์ชันสำหรับ component
  trackByAirline(index: number, airline: Airline): string {
    return airline.id || index.toString();
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // เพิ่มฟังก์ชันสำหรับ loading state
  isLoading = false;

  ngOnInit() {
    this.loadAirlines();
  }

  loadAirlines() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
