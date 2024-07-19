import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faEnvelope,
  faCircleUser,
  faAddressBook,
} from '@fortawesome/free-solid-svg-icons';
import { IsAuthenticatedDirective } from '../_directives/is-authenticated.directive';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, IsAuthenticatedDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  accountService = inject(AccountService);
  faUsers = faUsers;
  faEnvelope = faEnvelope;
  faCircleUser = faCircleUser;
  faAddressBook = faAddressBook;
}
