import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-term-conditions',
  imports: [],
  templateUrl: './term-conditions.component.html',
  styleUrl: './term-conditions.component.scss',
})
export class TermConditionsComponent {
  constructor(private router: Router, private location: Location) {}

  goBack() {
    // กลับไปหน้า register
    this.router.navigate(['auth/register']);

    // หรือใช้ history back
    // this.location.back();
  }

  acceptAndContinue() {
    // บันทึกว่าผู้ใช้ยอมรับข้อกำหนดแล้ว
    localStorage.setItem('terms_accepted', 'true');

    // กลับไปหน้า register พร้อมข้อมูลที่ยอมรับแล้ว
    this.router.navigate(['auth/register'], {
      queryParams: { terms: 'accepted' },
    });
  }
}
