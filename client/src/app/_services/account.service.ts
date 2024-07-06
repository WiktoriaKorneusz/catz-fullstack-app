import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { FollowsService } from './follows.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private followsService = inject(FollowsService);
  private http = inject(HttpClient);
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  // constructor(
  //   private http: HttpClient,
  //   private followsService: FollowsService
  // ) {}

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
    console.log(model);
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
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
    // console.log('bonkkkk');
    this.currentUserSource.next(user);
    this.followsService.getFolloweesIds();
  }

  logout() {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem('user');
      this.currentUserSource.next(null);
    }
  }
}
