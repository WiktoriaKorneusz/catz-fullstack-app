import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MembersService } from '../../_services/members.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './user-messages.component.html',
  styleUrl: './user-messages.component.css',
})
export class UserMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagePanel') messagePanel?: any;
  messageService = inject(MessageService);
  toastr = inject(ToastrService);
  accountService = inject(AccountService);
  membersService = inject(MembersService);
  currentUser: User | undefined;
  private route = inject(ActivatedRoute);
  userId = Number(this.route.snapshot.paramMap.get('id'));
  targetUsername = '';
  messageToSend = '';
  // messages: Message[] = [];
  faArrowRight = faArrowRight;
  faTrash = faTrash;
  faFloppyDisk = faFloppyDisk;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  ngOnInit(): void {
    // this.loadMessages();
    this.membersService.getMemberbyId(this.userId.toString()).subscribe({
      next: (member) => {
        if (!member) return;
        this.targetUsername = member.userName;
      },
    });
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        if (user == null) return;
        this.currentUser = user;
      },
    });

    console.log(this.currentUser);
    console.log(this.userId);
    if (!this.currentUser) return;
    this.messageService.createHubConnection(this.currentUser, this.userId);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messagePanel) {
      try {
        this.messagePanel.nativeElement.scrollTop =
          this.messagePanel.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll to bottom failed:', err);
      }
    }
  }
  // loadMessages(): void {
  //   if (!this.userId) return;
  //   this.messageService.getMessageThread(this.userId).subscribe({
  //     next: (messages) => {
  //       this.messages = messages;
  //
  //     },
  //   });
  // }

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
  // via api call
  // sendMessage() {
  //   this.messageService.sendMessage(this.userId, this.messageToSend).subscribe({
  //     next: (message) => {
  //       this.messages.push(message);
  //       this.messageToSend = '';
  //     },
  //     error: (err) =>
  //       this.toastr.error(err.Message, 'Failed to send message', {
  //         timeOut: 1000,
  //       }),
  //   });
  // }

  sendMessage() {
    this.messageService
      .sendMessage(this.userId, this.messageToSend)
      .then(() => {
        this.messageToSend = '';
      });
    this.scrollToBottom();
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id);
  }

  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }
}
