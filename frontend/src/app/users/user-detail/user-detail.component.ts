import { Component, inject } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  faUser,
  faImage,
  faPenToSquare,
  faPlus,
  faTrash,
  faUserPlus,
  faUserMinus,
  faComment,
  faCircle,
  faRightFromBracket,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Post } from '../../_models/post';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { FollowsService } from '../../_services/follows.service';
import { PresenceService } from '../../_services/presence.service';
import { UserData } from '../../_models/userData';
import { PostsService } from '../../_services/posts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  private followsService = inject(FollowsService);
  presenceService = inject(PresenceService);
  postsService = inject(PostsService);
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isFollowed: boolean = false;
  faComment = faComment;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;
  faUser = faUser;
  faTrash = faTrash;
  faPlus = faPlus;
  faImage = faImage;
  faPenToSquare = faPenToSquare;
  faCircle = faCircle;
  faRightFromBracket = faRightFromBracket;
  faMagnifyingGlass = faMagnifyingGlass;

  loggedUser = this.accountService.currentUser();
  user: UserData = {} as UserData;
  posts: Post[] = [];
  isUserLoggedUser: boolean = false;
  pageSize = 3;
  pageNumber = 1;
  searchTerm = '';

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    let username = this.route.snapshot.paramMap.get('username');
    if (username == null) {
      if (!this.loggedUser || this.loggedUser.username == null) return;
      username = this.loggedUser.username;
    }
    this.memberService.getUserData(username).subscribe({
      next: (member) => {
        this.user = member;
        if (this.loggedUser?.username === username) {
          this.isUserLoggedUser = true;
        }
        this.isFollowed =
          this.user.id !== null &&
          this.followsService.followeesIds().includes(this.user.id);
        this.loadPosts(this.user.id);
      },
      error: (err) => console.log(err),
    });
  }
  search() {
    if (this.searchTerm.trim()) {
      this.pageNumber = 1;
      this.loadPosts(this.user.id);
    }
  }

  loadPosts(userId: number) {
    this.postsService.getUserPosts(
      this.pageNumber,
      this.pageSize,
      this.searchTerm,
      userId
    );
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadPosts(this.user.id);
  }

  toggleFollow() {
    const userId = this.user?.id ?? null;
    if (userId != null) {
      this.followsService.toggleFollow(userId).subscribe({
        next: () => {
          if (this.isFollowed) {
            this.followsService.followeesIds.update((ids) =>
              ids.filter((x) => x !== userId)
            );
          } else {
            this.followsService.followeesIds.update((ids) => [...ids, userId]);
          }
          this.isFollowed = !this.isFollowed;
        },
      });
    }
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
