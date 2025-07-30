import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked,HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ChatUser {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

@Component({
  selector: 'app-message',
  imports: [CommonModule,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  searchTerm: string = '';
  currentMessage: string = '';
  selectedChat: ChatUser | null = null;
  isMobileSidebarOpen: boolean = false;

  chatList: ChatUser[] = [
    {
      id: 1,
      name: 'User 1',
      lastMessage: 'How are you?',
      time: '10:30',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'User 2',
      lastMessage: 'See you tomorrow!',
      time: '09:15',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'User 3',
      lastMessage: 'Thanks for the help',
      time: 'Yesterday',
      unread: 1,
      online: true
    },
    {
      id: 4,
      name: 'Group Chat',
      lastMessage: 'John: Let\'s meet at 3pm',
      time: 'Yesterday',
      unread: 5,
      online: false
    },
    {
      id: 5,
      name: 'Alice Johnson',
      lastMessage: 'Perfect! 👍',
      time: 'Monday',
      unread: 0,
      online: true
    },
    {
      id: 6,
      name: 'Bob Smith',
      lastMessage: 'Can we reschedule?',
      time: 'Sunday',
      unread: 1,
      online: false
    },
    {
      id: 7,
      name: 'Sarah Wilson',
      lastMessage: 'Great work on the project!',
      time: 'Saturday',
      unread: 0,
      online: true
    }
  ];

  messages: Message[] = [
    {
      id: 1,
      text: 'Hi there! How\'s your day going?',
      sender: 'other',
      time: '10:25'
    },
    {
      id: 2,
      text: 'Hello! It\'s going great, thanks for asking. How about yours?',
      sender: 'me',
      time: '10:26'
    },
    {
      id: 3,
      text: 'That\'s wonderful to hear! I\'m doing well too. Working on some new projects.',
      sender: 'other',
      time: '10:28'
    },
    {
      id: 4,
      text: 'Sounds exciting! What kind of projects are you working on?',
      sender: 'me',
      time: '10:29'
    },
    {
      id: 5,
      text: 'I\'m building a new chat application with Angular. It\'s been really fun to work on!',
      sender: 'other',
      time: '10:30'
    }
  ];

  private shouldScrollToBottom = false;

  constructor() { }

  ngOnInit(): void {
    // Select the first chat by default
    if (this.chatList.length > 0) {
      this.selectedChat = this.chatList[0];
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  get filteredChats(): ChatUser[] {
    if (!this.searchTerm) {
      return this.chatList;
    }
    
    return this.chatList.filter(chat =>
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectChat(chat: ChatUser): void {
    this.selectedChat = chat;
    
    // Close mobile sidebar when chat is selected
    this.isMobileSidebarOpen = false;
    
    // Mark chat as read
    if (chat.unread > 0) {
      const chatIndex = this.chatList.findIndex(c => c.id === chat.id);
      if (chatIndex !== -1) {
        this.chatList[chatIndex].unread = 0;
      }
    }

    // Load messages for selected chat (in real app, this would be an API call)
    this.loadMessagesForChat(chat.id);
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.selectedChat) {
      return;
    }

    const newMessage: Message = {
      id: this.messages.length + 1,
      text: this.currentMessage.trim(),
      sender: 'me',
      time: this.getCurrentTime()
    };

    this.messages.push(newMessage);
    this.currentMessage = '';
    this.shouldScrollToBottom = true;

    // Update last message in chat list
    const chatIndex = this.chatList.findIndex(c => c.id === this.selectedChat!.id);
    if (chatIndex !== -1) {
      this.chatList[chatIndex].lastMessage = newMessage.text;
      this.chatList[chatIndex].time = newMessage.time;
    }

    // Simulate receiving a response (optional)
    this.simulateResponse();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private loadMessagesForChat(chatId: number): void {
    // In a real application, you would load messages from an API
    // For now, we'll use the same messages for all chats
    
    // You can implement different message sets for different chats here
    switch (chatId) {
      case 1:
        // Current messages are fine for User 1
        break;
      case 2:
        this.messages = [
          {
            id: 1,
            text: 'Hey! Ready for tomorrow\'s meeting?',
            sender: 'other',
            time: '09:10'
          },
          {
            id: 2,
            text: 'Yes, I\'ve prepared all the documents.',
            sender: 'me',
            time: '09:12'
          },
          {
            id: 3,
            text: 'Great! See you tomorrow then.',
            sender: 'other',
            time: '09:15'
          }
        ];
        break;
      default:
        // Keep current messages for other chats
        break;
    }
  }

  private simulateResponse(): void {
    // Simulate receiving a response after 2-3 seconds
    const responses = [
      'That sounds interesting!',
      'I see what you mean.',
      'Could you tell me more about that?',
      'That\'s really cool!',
      'I agree with you.',
      'Thanks for sharing that.',
      'That makes sense.',
      'Interesting perspective!'
    ];

    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMessage: Message = {
        id: this.messages.length + 1,
        text: randomResponse,
        sender: 'other',
        time: this.getCurrentTime()
      };

      this.messages.push(responseMessage);
      this.shouldScrollToBottom = true;

      // Update chat list
      if (this.selectedChat) {
        const chatIndex = this.chatList.findIndex(c => c.id === this.selectedChat!.id);
        if (chatIndex !== -1) {
          this.chatList[chatIndex].lastMessage = responseMessage.text;
          this.chatList[chatIndex].time = responseMessage.time;
        }
      }
    }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
  }

  // Additional utility methods
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getTotalUnreadCount(): number {
    return this.chatList.reduce((total, chat) => total + chat.unread, 0);
  }

  markAllAsRead(): void {
    this.chatList.forEach(chat => chat.unread = 0);
  }

  getOnlineUsersCount(): number {
    return this.chatList.filter(chat => chat.online).length;
  }

  // Mobile navigation methods
  openMobileSidebar(): void {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  // Handle window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 768) {
      this.isMobileSidebarOpen = false;
    }
  }

  // Close sidebar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (this.isMobileSidebarOpen && 
        sidebar && 
        !sidebar.contains(target) && 
        menuBtn && 
        !menuBtn.contains(target)) {
      this.isMobileSidebarOpen = false;
    }
  }
}
