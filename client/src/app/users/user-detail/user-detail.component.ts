import { Component, computed, inject } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  faUser,
  faImage,
  faPenToSquare,
  faPlus,
  faTrash,
  faUserPlus,
  faUserMinus,
  faMessage,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Post } from '../../_models/post';
import { CommonModule } from '@angular/common';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { FollowsService } from '../../_services/follows.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  private followsService = inject(FollowsService);
  isFollowed: boolean = false;
  faComment = faComment;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;
  faUser = faUser;
  faTrash = faTrash;
  faPlus = faPlus;
  faImage = faImage;
  faPenToSquare = faPenToSquare;
  user: Member | undefined;
  loggedUser: User | null = null;
  posts: Post[] = [];
  isUserLoggedUser: boolean = false;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    //finding out if there is logged user
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.loggedUser = user;
        // computed(() => {
        //   const userId = this.user?.id ?? null;
        //   return (
        //     userId !== null && this.followsService.followeesIds().includes(userId)
        //   );
        // });
      },
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) {
      this.loadLoggedUser();
      return;
    }
    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.user = member;
        this.posts = member.posts;
        if (this.loggedUser?.username === username) {
          this.isUserLoggedUser = true;
        }
        this.isFollowed =
          this.user.id !== null &&
          this.followsService.followeesIds().includes(this.user.id);
      },
      error: (err) => console.log(err),
    });
  }

  loadLoggedUser() {
    if (!this.loggedUser) return;
    this.memberService.getMember(this.loggedUser.username).subscribe({
      next: (member) => {
        this.user = member;
        this.posts = member.posts;
        this.isUserLoggedUser = true;
        console.log(this.isUserLoggedUser); // Log here after assignment
      },
      error: (err) => console.log(err),
    });
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
}
