import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  messageService = inject(MessageService);
  accountService = inject(AccountService);
  currentUsername: string | undefined;
  type = 'Unread'; //gjyfhdgd
  pageSize = 5;
  pageNumber = 1;

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.currentUsername = user?.username;
      },
    });
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.type.toLowerCase()
    );
  }

  getType(): string {
    return this.type;
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadMessages();
  }

  handleChange() {
    this.loadMessages();
  }

  shortenMessage(str: string): string {
    if (str.length <= 25) {
      return str;
    } else {
      return str.substring(0, 25) + '...';
    }
  }
}
