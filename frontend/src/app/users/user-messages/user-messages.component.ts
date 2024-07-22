import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { CommonModule } from '@angular/common';
import {
  faArrowRight,
  faFloppyDisk,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
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
export class UserMessagesComponent implements OnInit {
  @ViewChild('messagePanel') messagePanel?: any;
  messageService = inject(MessageService);
  toastr = inject(ToastrService);
  accountService = inject(AccountService);
  membersService = inject(MembersService);
  private route = inject(ActivatedRoute);
  currentUser: User | null = null;
  userId = Number(this.route.snapshot.paramMap.get('id'));
  targetUsername = '';
  messageToSend = '';
  messageCount = 0;
  faArrowRight = faArrowRight;
  faTrash = faTrash;
  faFloppyDisk = faFloppyDisk;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  ngOnInit(): void {
    this.membersService.getMemberbyId(this.userId.toString()).subscribe({
      next: (member) => {
        if (!member) return;
        this.targetUsername = member.userName;
      },
    });
    this.currentUser = this.accountService.currentUser();

    if (!this.currentUser) return;
    this.messageService.createHubConnection(this.currentUser, this.userId);

    this.messageService.getMessageCount(this.userId).subscribe({
      next: (count) => (this.messageCount = count),
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
    this.messageService
      .sendMessage(this.userId, this.messageToSend)
      .then(() => {
        this.messageToSend = '';
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id);
  }

  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }

  loadMore(targetId: number) {
    // console.log(this.messageService.messageThread().length);
    if (this.messageService.messageThread().length >= this.messageCount) return;
    this.messageService.loadMoreMessages(
      this.messageService.messageThread().length,
      targetId
    );
  }
}
