import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  //(null)
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user && this.isLocalStorageAvailable) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any) {
    // const newUser = {username: model.username, password: model.password};
    return this.http
      .post<User>(this.baseUrl + 'account/register', {
        username: model.username,
        password: model.password,
      })
      .pipe(
        map((response: User) => {
          const user = response;
          if (user && this.isLocalStorageAvailable) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
          // return user;
        })
      );
  }

  setCurrentUser(user: User) {
    console.log(user);
    this.currentUserSource.next(user);
  }

  logout() {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem('user');
      this.currentUserSource.next(null);
    }
  }
}
