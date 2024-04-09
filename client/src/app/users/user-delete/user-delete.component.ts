import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css',
})
export class UserDeleteComponent {
  currentUser: User | null = null;
  constructor(public accountService: AccountService) {
    this.accountService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
