import { Component, Input } from '@angular/core';
import { Member } from '../../_models/member';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  providers: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  faUserPlus = faUserPlus;

  // @Input() user: Member = {} as Member;
  @Input() user: Member | undefined;
}
