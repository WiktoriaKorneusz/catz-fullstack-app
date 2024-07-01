import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { UserInfo } from '../_models/userInfo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  paginatedResult: PaginatedResult<UserInfo[]> = new PaginatedResult<
    UserInfo[]
  >();
  // userParams = model<UserParams>(new UserParams());

  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params = params.append('minimalAge', userParams.minimalAge);
    params = params.append('maximalAge', userParams.maximalAge);
    params = params.append('orderBy', userParams.orderBy);

    console.log('Calling getMembers with params:', params.toString()); // Add this line
    return this.getPaginationResult<UserInfo[]>(
      this.baseUrl + 'users/infos',
      params
    );
  }

  private getPaginationResult<T>(url: string, params: HttpParams) {
    const paginationResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params: params }).pipe(
      map((response) => {
        if (response.body) {
          paginationResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginationResult.pagination = JSON.parse(pagination);
        }
        return paginationResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, itemsPerPage: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('itemsPerPage', itemsPerPage);

    return params;
  }

  getMember(username: string) {
    return this.http.get<Member>(
      this.baseUrl + 'users/' + username
      // this.getHttpOptions()
    );
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

  // getHttpOptions() {
  //   if (this.isLocalStorageAvailable) {
  //     const userString = localStorage.getItem('user');
  //     if (!userString) return;
  //     const user = JSON.parse(userString);
  //     return {
  //       headers: new HttpHeaders({
  //         Authorization: `Bearer ${user.token}`,
  //       }),
  //     };
  //   } else {
  //     return;
  //   }
  // }
}
