import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-moderate-users',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './moderate-users.component.html',
  styleUrl: './moderate-users.component.css',
})
export class ModerateUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private accountService = inject(AccountService);
  loggedUser: User | null = null;
  users: User[] = [];

  ngOnInit(): void {
    this.getUsers();
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
    });
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => (this.users = users),
    });
  }
  updateRoles(userId: number, newRoles: string): void {
    // console.log(`User ID: ${userId}, New Role: ${newRole}`);
    this.adminService.updateUserRoles(userId, [newRoles]).subscribe({
      next: (roles) => {
        const user = this.users.find((user) => user.id === userId);
        if (user == undefined || user.roles == undefined) return;
        user.roles = newRoles.split(',');
      },
    });
  }
}
