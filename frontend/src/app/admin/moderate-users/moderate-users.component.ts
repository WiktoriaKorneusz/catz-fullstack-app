import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { RouterModule } from '@angular/router';
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

  private pageSize = 5;
  private pageNumber = 1;
  faMagnifyingGlass = faMagnifyingGlass;
  searchTerm = '';

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.adminService.getUsers(this.pageNumber, this.pageSize, this.searchTerm);
  }
  updateRoles(userId: number, newRoles: string): void {
    this.adminService.updateUserRoles(userId, [newRoles]).subscribe({
      next: () => {
        const paginatedResult = this.adminService.paginatedUsers();
        if (paginatedResult && paginatedResult.items) {
          const user = paginatedResult.items.find((user) => user.id === userId);
          if (user && user.roles) {
            user.roles = newRoles.split(',');
          }
        }
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
