import { Component, Input, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircle,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { UserInfo } from '../../_models/userInfo';
import { FollowsService } from '../../_services/follows.service';
import { PresenceService } from '../../_services/presence.service';

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
  private presenceService = inject(PresenceService);
  user = input.required<UserInfo>();

  isFollowed = computed(() =>
    this.followsService.followeesIds().includes(this.user().id)
  );
  isOnline = computed(() =>
    this.presenceService.onlineUsers().includes(this.user().id)
  );
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;
  faCircle = faCircle;

  toggleFollow() {
    const userId = this.user().id ?? null;
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
