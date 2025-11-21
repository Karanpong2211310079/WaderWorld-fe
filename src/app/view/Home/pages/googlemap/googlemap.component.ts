import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-googlemap',
  imports: [],
  templateUrl: './googlemap.component.html',
  styleUrl: './googlemap.component.scss',
})
export class GooglemapComponent {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  map!: google.maps.Map;
  marker!: google.maps.Marker;

  // ตัวอย่างพิกัดเริ่มต้น
  latitude = 13.7563;
  longitude = 100.5018;
  zoom = 12;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // สร้าง map
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: this.zoom,
    });

    // สร้าง marker
    this.marker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      title: 'Bangkok, Thailand',
    });

    // สร้าง SearchBox
    const input = document.getElementById('map-search') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      // ✅ ตรวจสอบ null / undefined ก่อน
      if (!places || places.length === 0) return;

      // ลบ marker เก่า
      if (this.marker) {
        this.marker.setMap(null);
      }

      // เพิ่ม marker ใหม่
      const place = places[0];

      if (!place.geometry || !place.geometry.location) return; // ตรวจสอบ geometry

      this.marker = new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location,
      });

      // move map center
      this.map.panTo(place.geometry.location);
      this.map.setZoom(15);
    });
  }
}
