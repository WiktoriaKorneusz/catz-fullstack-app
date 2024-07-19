import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  private HubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, targetId: number) {
    this.HubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?target=' + targetId, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.HubConnection.start().catch((error) => console.log(error));

    this.HubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.HubConnection.on('ReceiveMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });

    this.HubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.UserId === user.id)) {
        this.messageThread.update((messages) => {
          messages.forEach((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          return messages;
        });
      }
    });

    // this.HubConnection.on('DeletedMessage', (id) => {
    //   this.messageThread.update((messages) =>
    //     messages.filter((m) => m.id !== id)
    //   );
    // });
  }

  stopHubConnection() {
    if (this.HubConnection?.state === HubConnectionState.Connected) {
      this.HubConnection?.stop().catch((error) => console.log(error));
    }
  }

  getMessages(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    type: string
  ) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);

    params = params.append('type', type);

    return this.http
      .get<Message[]>(this.baseUrl + 'messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  getMessageThread(id: number) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + id);
  }

  async sendMessage(recipientId: number, content: string) {
    // return this.http.post<Message>(this.baseUrl + 'messages', {
    //   recipientId,
    //   content,
    // });
    return this.HubConnection?.invoke('SendMessage', {
      recipientId,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id).subscribe({
      next: () => {
        this.messageThread.update((messages) =>
          messages.filter((m) => m.id !== id)
        );
      },
    });
  }
}
