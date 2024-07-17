import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-moderate-users',
  standalone: true,
  imports: [RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './moderate-users.component.html',
  styleUrl: './moderate-users.component.css',
})
export class ModerateUsersComponent implements OnInit {
  adminService = inject(AdminService);
  private accountService = inject(AccountService);
  loggedUser: User | null = null;
  private pageSize = 5;
  private pageNumber = 1;
  faMagnifyingGlass = faMagnifyingGlass;
  searchTerm = '';
  // users: User[] = [];

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
    });
    this.getUsers();
  }

  getUsers(): void {
    this.adminService.getUsers(this.pageNumber, this.pageSize, this.searchTerm);
  }
  updateRoles(userId: number, newRoles: string): void {
    // console.log(`User ID: ${userId}, New Role: ${newRole}`);
    this.adminService.updateUserRoles(userId, [newRoles]).subscribe({
      next: () => {
        const paginatedResult = this.adminService.paginatedResult();
        if (paginatedResult && paginatedResult.items) {
          const user = paginatedResult.items.find((user) => user.id === userId);
          if (user && user.roles) {
            user.roles = newRoles.split(',');
          }
        }

        // this.getUsers();
      },
    });
  }

  changePage(pageNumber: number) {
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = pageNumber;
    this.getUsers();
    this.searchTerm = searchValue;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.pageNumber = 1;
      this.getUsers();
    }
  }
}
