import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  messageService = inject(MessageService);
  accountService = inject(AccountService);
  currentUsername: string | undefined;
  type = 'Unread';
  pageSize = 5;
  pageNumber = 1;
  searchTerm = '';
  faMagnifyingGlass = faMagnifyingGlass;

  ngOnInit(): void {
    this.currentUsername = this.accountService.currentUser()?.username;

    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.searchTerm,
      this.type.toLowerCase()
    );
  }

  getType(): string {
    return this.type;
  }

  changePage(pageNumber: number) {
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = pageNumber;
    this.loadMessages();
    this.searchTerm = searchValue;
  }

  handleChange() {
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = 1;
    this.loadMessages();
    this.searchTerm = searchValue;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.pageNumber = 1;
      this.loadMessages();
    }
  }

  shortenMessage(str: string): string {
    if (str.length <= 25) {
      return str;
    } else {
      return str.substring(0, 25) + '...';
    }
  }
}
