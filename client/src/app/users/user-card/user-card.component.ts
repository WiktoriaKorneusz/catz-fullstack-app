import { Component, Input, computed, inject } from '@angular/core';
import { Member } from '../../_models/member';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { UserInfo } from '../../_models/userInfo';
import { FollowsService } from '../../_services/follows.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  providers: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  private followsService = inject(FollowsService);
  isFollowed = computed(() => {
    const userId = this.user?.id ?? null;
    return (
      userId !== null && this.followsService.followeesIds().includes(userId)
    );
  });
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;

  // @Input() user: Member = {} as Member;
  @Input() user: UserInfo | undefined;

  toggleFollow() {
    const userId = this.user?.id ?? null;
    if (userId !== null) {
      this.followsService.toggleFollow(userId).subscribe({
        next: () => {
          if (this.isFollowed()) {
            this.followsService.followeesIds.update((ids) =>
              ids.filter((x) => x !== userId)
            );
          } else {
            this.followsService.followeesIds.update((ids) => [...ids, userId]);
          }
        },
      });
    }
  }
}
