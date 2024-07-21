import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { HomeComponent } from './home/home.component';
import { SpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    FormsModule,
    HomeComponent,
    RouterModule,
    SpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  title = 'Catz';
  users: any;

  ngOnInit(): void {
    this.setUser();
  }

  setUser() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && Object.keys(user).length > 0)
      this.accountService.setCurrentUser(user);
    else return;
  }
}
