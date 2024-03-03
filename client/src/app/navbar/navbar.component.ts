import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faEnvelope,
  faCircleUser,
  faAddressBook,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  faUsers = faUsers;
  faEnvelope = faEnvelope;
  faCircleUser = faCircleUser;
  faAddressBook = faAddressBook;
}
