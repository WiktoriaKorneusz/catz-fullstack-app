import { Injectable, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { UserRoles } from '../_models/userRoles';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<UserRoles[]> | null>(null);

  getUsers(pageNumber: number, pageSize: number, searchTerm: string) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);

    return this.http
      .get<UserRoles[]>(this.baseUrl + 'admin/users', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  updateUserRoles(userId: number, roles: string[]) {
    return this.http.post<string[]>(
      this.baseUrl + 'admin/edit-roles/' + userId + '?roles=' + roles,
      {}
    );
  }
}
