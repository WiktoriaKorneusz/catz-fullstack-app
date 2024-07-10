import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  // messageThread = signal<Message[]>([]);

  getMessages(pageNumber: number, pageSize: number, type: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);

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

  sendMessage(recipientId: number, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientId,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
