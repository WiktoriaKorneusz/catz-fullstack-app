import { Injectable, inject } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>(this.baseUrl + 'admin/users');
  }

  updateUserRoles(userId: number, roles: string[]) {
    return this.http.post<string[]>(
      this.baseUrl + 'admin/edit-roles/' + userId + '?roles=' + roles,
      {}
    );
  }
}
