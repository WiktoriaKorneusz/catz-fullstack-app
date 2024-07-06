import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  title = 'Catz';
  users: any;
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // this.getUsers();
    this.setUser();
  }
  // testInterceptor() {
  //   this.http.get('http://localhost:5248/api/users').subscribe((res) => {
  //     console.log(res);
  //   });
  // }

  setUser() {
    // const user : User = JSON.parse(localStorage.getItem('user')!);
    if (!this.isLocalStorageAvailable) return;

    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log(user);
    if (user && Object.keys(user).length > 0)
      this.accountService.setCurrentUser(user);
    // const user: User = JSON.parse(userString);
    else return;
  }

  // getUsers() {
  //   this.http.get('http://localhost:5248/api/users').subscribe({
  //     next: (response) => (this.users = response),
  //     // next: (response) => console.log(response),
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {
  //       console.log('users request complete');
  //     },
  //   });
  // }
}
