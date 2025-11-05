import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private unsubscribe$ = new Subject<void>();

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  public id: any = this.authen.getUserId();
  public message: any[] = [];
  public chatroom_messages: any[] = [];
  public sendMessageForm = new FormControl('');
  public isLoading = false;
  public selectedChatroom: any = null;
  private refreshInterval: any = null; // 🕐 สำหรับเก็บ setInterval id

  ngOnInit(): void {
    this.getChatroomWithLastMessage(this.id);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.refreshInterval) clearInterval(this.refreshInterval); // 🧹 ล้าง interval ตอนออก
  }

  // ✅ ดึงรายการห้องทั้งหมด
  public getChatroomWithLastMessage(user_id: any) {
    const payload = { user_id: parseInt(user_id) };
    console.log('📦 Payload for Chatrooms:', payload);

    this.restapi
      .post('message/get_all_messages/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.message = response?.messages || [];
          console.log('💬 Chatrooms with Messages:', this.message);
        },
        error: (err) => console.error('❌ Chatroom load error:', err),
      });
  }

  // ✅ เลือกห้อง
  public selectChatroom(chatroom: any) {
    this.selectedChatroom = chatroom;
    this.getChatroomMessage(chatroom.chatroomId);

    // 🕒 ตั้งให้รีเฟรชทุก 2 วินาที
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      if (this.selectedChatroom) {
        this.getChatroomMessage(this.selectedChatroom.chatroomId);
      }
    }, 2000);
  }

  // ✅ ดึงข้อความในห้อง
  public getChatroomMessage(chatroom_id: number) {
    const payload = {
      user_id: parseInt(this.id),
      chatroom_id: chatroom_id,
    };
    console.log('📦 Payload for Chatroom Messages:', payload);
    this.restapi
      .post('message/get_chatroom_message/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.chatroom_messages = response?.messages || [];
          console.log('📨 Messages:', this.chatroom_messages);

          // auto scroll ลงข้อความล่าสุด
          setTimeout(() => this.scrollToBottom(), 100);
        },
      });
  }

  // ✅ ส่งข้อความ
  public sendMessage() {
    const content = this.sendMessageForm.value?.trim();
    if (!this.selectedChatroom || !content) return;

    this.isLoading = true;
    const payload = {
      chatroom_id: this.selectedChatroom.chatroomId,
      sender_id: parseInt(this.id),
      content: content,
    };

    console.log('📤 Sending Message:', payload);

    this.restapi
      .post('message/send_message/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.sendMessageForm.setValue('');
          this.getChatroomMessage(this.selectedChatroom.chatroomId);
          this.getChatroomWithLastMessage(this.id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Send Message Error:', err);
          this.isLoading = false;
        },
      });
  }

  // ✅ scroll อัตโนมัติ
  private scrollToBottom() {
    try {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch {}
  }
}
