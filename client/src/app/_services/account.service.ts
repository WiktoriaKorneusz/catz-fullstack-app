import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { FollowsService } from './follows.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private followsService = inject(FollowsService);
  private presenceService = inject(PresenceService);
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
    if (!this.isLocalStorageAvailable) return;
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSource.next(user);
    // console.log(user);
    this.followsService.getFolloweesIds();
    this.presenceService.createHubConnection(user);
  }

  logout() {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem('user');
      this.currentUserSource.next(null);
      this.presenceService.stopHubConnection();
    }
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
