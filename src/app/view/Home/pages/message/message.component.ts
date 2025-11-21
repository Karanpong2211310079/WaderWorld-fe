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
  public message: any[] = []; // chatrooms ดั้งเดิม
  public filteredMessage: any[] = []; // chatrooms หลัง filter
  public chatroom_messages: any[] = []; // ข้อความในห้อง
  public sendMessageForm = new FormControl('');
  public searchControl = new FormControl('');
  public isLoading = false;
  public selectedChatroom: any = null;
  private refreshInterval: any = null;

  ngOnInit(): void {
    this.getChatroomWithLastMessage(this.id);

    // 🔍 Search filter ใน client-side
    this.searchControl.valueChanges.subscribe((term: string | null) => {
      const lowerTerm = (term ?? '').toLowerCase();
      this.filteredMessage = this.message.filter(
        (chatroom) =>
          chatroom.OtherUsername.toLowerCase().includes(lowerTerm) ||
          (chatroom.LastMessage?.toLowerCase().includes(lowerTerm) ?? false)
      );
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  // ดึงรายการ chatrooms
  getChatroomWithLastMessage(user_id: any) {
    const payload = { user_id: parseInt(user_id) };
    this.restapi
      .post('message/get_all_messages/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.message = response?.chatrooms || [];
          this.filteredMessage = [...this.message]; // สำหรับ filter
        },
        error: (err) => console.error('❌ Chatroom load error:', err),
      });
  }

  // เลือกห้อง
  selectChatroom(chatroom: any) {
    this.selectedChatroom = chatroom;
    this.getChatroomMessage(chatroom.chatroomId);

    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      if (this.selectedChatroom) {
        this.getChatroomMessage(this.selectedChatroom.chatroomId);
      }
    }, 2000);
  }

  // ดึงข้อความในห้อง
  getChatroomMessage(chatroom_id: number) {
    const payload = { user_id: parseInt(this.id), chatroom_id };
    this.restapi
      .post('message/get_chatroom_message/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.chatroom_messages = response?.messages || [];
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error('❌ Chatroom message error:', err),
      });
  }

  // ส่งข้อความ
  sendMessage() {
    const content = this.sendMessageForm.value?.trim();
    if (!this.selectedChatroom || !content) return;

    this.isLoading = true;
    const payload = {
      chatroom_id: this.selectedChatroom.chatroomId,
      sender_id: parseInt(this.id),
      content,
    };
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

  // scroll อัตโนมัติ
  private scrollToBottom() {
    try {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch {}
  }

  // trackBy สำหรับ ngFor
  trackByChatroomId(index: number, chatroom: any) {
    return chatroom.chatroom_id;
  }

  trackByMessageId(index: number, msg: any) {
    return msg.id;
  }
}
