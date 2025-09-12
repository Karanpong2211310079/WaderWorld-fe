import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked,HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormControl,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-message',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent  {
  public message = new FormControl('');

 ngOnInit(): void {
    // เช็คค่าตลอดเวลา realtime
    this.message.valueChanges.subscribe(value => {
      console.log('Message:', value); 
      // สามารถใช้ value เพื่อ show/hide ปุ่มหรือ icon
    });
  }
}
