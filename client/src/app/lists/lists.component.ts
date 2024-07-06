import { Component, OnInit, inject } from '@angular/core';
import { FollowsService } from '../_services/follows.service';
import { UserInfo } from '../_models/userInfo';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from '../users/user-card/user-card.component';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, UserCardComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  followsService = inject(FollowsService);
  choice = 'followees';
  pageNumber = 1;
  pageSize = 5;

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
    this.followsService.getFollows(this.choice, this.pageNumber, this.pageSize);
  }

  handleChange() {
    this.getCoice();
    this.loadFollows();
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadFollows();
  }
}
