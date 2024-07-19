import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { AdminService } from '../../_services/admin.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moderate-posts',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './moderate-posts.component.html',
  styleUrl: './moderate-posts.component.css',
})
export class ModeratePostsComponent {
  adminService = inject(AdminService);
  private pageSize = 6;
  private pageNumber = 1;
  faMagnifyingGlass = faMagnifyingGlass;
  searchTerm = '';

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.adminService.getPosts(this.pageNumber, this.pageSize, this.searchTerm);
  }

  changePage(pageNumber: number) {
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = pageNumber;
    this.getPosts();
    this.searchTerm = searchValue;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.pageNumber = 1;
      this.getPosts();
    }
  }
}
