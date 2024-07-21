import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../_models/userInfo';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class FollowsService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  followeesIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<UserInfo[]> | null>(null);

  toggleFollow(followeeId: number) {
    return this.http.post(this.baseUrl + 'follow/' + followeeId, {});
  }

  getFollows(
    choice: string,
    pageNumber: number,
    pageSize: number,
    searchTerm: string
  ) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);
    params = params.append('choice', choice);
    return this.http
      .get<UserInfo[]>(this.baseUrl + 'follow', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
        error: (error) => console.log(error),
      });
  }

  getFolloweesIds() {
    return this.http
      .get<number[]>(this.baseUrl + 'follow/followeesids')
      .subscribe({
        next: (ids) => this.followeesIds.set(ids),
      });
  }
  getFollowersIds() {
    return this.http.get<number[]>(this.baseUrl + 'follow/followersids');
  }
}
