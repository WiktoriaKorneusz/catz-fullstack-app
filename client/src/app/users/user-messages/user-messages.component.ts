import { Component, OnInit, inject, input } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { CommonModule } from '@angular/common';
import {
  faArrowRight,
  faFloppyDisk,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClipboard,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import { Toast, ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './user-messages.component.html',
  styleUrl: './user-messages.component.css',
})
export class UserMessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  toastr = inject(ToastrService);
  accountService = inject(AccountService);
  currentUsername: string | undefined;
  private route = inject(ActivatedRoute);
  userId = Number(this.route.snapshot.paramMap.get('id'));
  targetUsername = '';
  messageToSend = '';
  messages: Message[] = [];
  faArrowRight = faArrowRight;
  faTrash = faTrash;
  faFloppyDisk = faFloppyDisk;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  ngOnInit(): void {
    this.loadMessages();
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.currentUsername = user?.username;
      },
    });
  }

  loadMessages(): void {
    if (!this.userId) return;
    this.messageService.getMessageThread(this.userId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.targetUsername =
          this.messages[0].senderId == this.userId
            ? this.messages[0].senderUsername
            : this.messages[0].recipientUsername;
      },
    });
  }

  copyMessageToClipboard(message: string) {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        this.toastr.success(
          'Message copied to clipboard successfully!',
          undefined,
          { timeOut: 1000 }
        );
      })
      .catch((err) => {
        this.toastr.error(err, 'Failed to copy the message to the clipboard', {
          timeOut: 1000,
        });
      });
  }
  sendMessage() {
    this.messageService.sendMessage(this.userId, this.messageToSend).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.messageToSend = '';
      },
      error: (err) =>
        this.toastr.error(err.Message, 'Failed to send message', {
          timeOut: 1000,
        }),
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages = this.messages.filter((m) => m.id !== id);
      },
      error: (err) =>
        this.toastr.error(err.Message, 'Failed to delete message', {
          timeOut: 1000,
        }),
    });
  }
}
