import { Component, OnInit, inject } from '@angular/core';
import { FollowsService } from '../_services/follows.service';
import { UserInfo } from '../_models/userInfo';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from '../users/user-card/user-card.component';
import { Pagination } from '../_models/pagination';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, UserCardComponent, FontAwesomeModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  followsService = inject(FollowsService);
  choice = 'followees';
  faMagnifyingGlass = faMagnifyingGlass;
  pageNumber = 1;
  pageSize = 5;
  searchTerm = '';

  ngOnInit(): void {
    this.loadFollows();
  }
  // changePage(pageNumber: number) {
  //   this.followsService.userParams().pageNumber = pageNumber;
  //   this.loadFollows();
  // }

  getCoice() {
    switch (this.choice) {
      case 'followers':
        return 'your followers';
      case 'followees':
        return 'Users you follow';
      default:
        return 'mutual followers';
    }
  }

  loadFollows() {
    this.followsService.getFollows(
      this.choice,
      this.pageNumber,
      this.pageSize,
      this.searchTerm
    );
  }

  handleChange() {
    this.getCoice();
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = 1;
    this.loadFollows();
    this.searchTerm = searchValue;
  }

  changePage(pageNumber: number) {
    const searchValue = this.searchTerm;
    this.searchTerm = '';
    this.pageNumber = pageNumber;
    this.loadFollows();
    this.searchTerm = searchValue;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.pageNumber = 1;
      this.loadFollows();
    }
  }
}
