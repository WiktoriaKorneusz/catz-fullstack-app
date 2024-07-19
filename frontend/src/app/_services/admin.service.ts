import { Injectable, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { UserRoles } from '../_models/userRoles';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { UserPost } from '../_models/userPost';
import { PostDisplay } from '../_models/postDisplay';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedUsers = signal<PaginatedResult<UserRoles[]> | null>(null);
  paginatedPosts = signal<PaginatedResult<UserPost[]> | null>(null);

  getUsers(pageNumber: number, pageSize: number, searchTerm: string) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);

    return this.http
      .get<UserRoles[]>(this.baseUrl + 'admin/users', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => setPaginatedResponse(response, this.paginatedUsers),
      });
  }

  updateUserRoles(userId: number, roles: string[]) {
    return this.http.post<string[]>(
      this.baseUrl + 'admin/edit-roles/' + userId + '?roles=' + roles,
      {}
    );
  }

  getPosts(pageNumber: number, pageSize: number, searchTerm: string) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);

    return this.http
      .get<UserPost[]>(this.baseUrl + 'admin/posts', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => setPaginatedResponse(response, this.paginatedPosts),
      });
  }

  getPost(postId: number) {
    return this.http.get<PostDisplay>(this.baseUrl + 'admin/posts/' + postId);
  }

  approvePost(postId: number) {
    return this.http.put(this.baseUrl + 'admin/posts/' + postId, {});
  }
  disapprovePost(postId: number) {
    return this.http.delete(this.baseUrl + 'admin/posts/' + postId);
  }
}
