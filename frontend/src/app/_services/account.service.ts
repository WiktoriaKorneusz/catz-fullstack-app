import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { FollowsService } from './follows.service';
import { PresenceService } from './presence.service';
import { ResetPasword } from '../_models/resetPassword';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private followsService = inject(FollowsService);
  private presenceService = inject(PresenceService);
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;

        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model);
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.followsService.getFolloweesIds();
    this.presenceService.createHubConnection(user);
  }

  confirmEmail(email: string, token: string) {
    return this.http.get(
      this.baseUrl +
        'account/email-confirmation?token=' +
        token +
        '&email=' +
        email
    );
  }

  forgotPassword(forgotPasswordModel: any) {
    return this.http.post(
      this.baseUrl + 'account/forgot-password',
      forgotPasswordModel
    );
  }

  resetPassword(resetPasswordModel: ResetPasword) {
    return this.http.post(
      this.baseUrl + 'account/reset-password',
      resetPasswordModel
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
