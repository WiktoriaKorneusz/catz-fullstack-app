import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { UserInfo } from '../_models/userInfo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { UserData } from '../_models/userData';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<UserInfo[]> | null>(null);

  userParams = signal<UserParams>(new UserParams());

  resetUserParams() {
    this.userParams.set(new UserParams());
  }
  getMembers() {
    let params = setPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize,
      this.userParams().searchTerm
    );

    params = params.append('minimalAge', this.userParams().minimalAge);
    params = params.append('maximalAge', this.userParams().maximalAge);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http
      .get<UserInfo[]>(this.baseUrl + 'users/infos', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedResponse(response, this.paginatedResult);
        },
      });
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  getUserData(username: string) {
    return this.http.get<UserData>(this.baseUrl + 'users/data/' + username);
  }
  getMemberbyId(id: string) {
    return this.http.get<Member>(this.baseUrl + 'users/get-by-id/' + id);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(postId: number, photoId: number) {
    return this.http.put(
      this.baseUrl + 'users/set-main-photo/' + postId + '/' + photoId,
      {}
    );
  }
}
