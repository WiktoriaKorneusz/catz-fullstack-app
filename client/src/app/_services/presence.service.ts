import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { Toast, ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers = signal<number[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (userId) => {
      this.onlineUsers.update((users) => [...users, userId]);
    });

    this.hubConnection.on('UserIsOffline', (userId) => {
      this.onlineUsers.update((users) => users.filter((x) => x !== userId));
    });

    this.hubConnection.on('GetOnlineUsers', (userIds) => {
      this.onlineUsers.set(userIds);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, userId }) => {
      this.toastr
        .info('New message from ' + username)
        .onTap.pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/messages/' + userId));
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection?.stop().catch((error) => console.log(error));
    }
  }
}
