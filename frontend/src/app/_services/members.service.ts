import { Injectable, inject, signal, model } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { UserInfo } from '../_models/userInfo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { UserData } from '../_models/userData';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<UserInfo[]> | null>(null);

  // private AccountService = inject(AccountService);
  // user = this.AccountService.currentUser$;
  userParams = signal<UserParams>(new UserParams());

  // constructor(private http: HttpClient) {}

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

  // getUserParams() {
  //   return this.userParams();
  // }

  setUserParams(params: UserParams) {
    this.userParams.set(params);
  }

  // getMembers() {
  //   let params = this.getPaginationHeaders(
  //     this.userParams().pageNumber,
  //     this.userParams().pageSize
  //   );
  //   params = params.append('minimalAge', this.userParams().minimalAge);
  //   params = params.append('maximalAge', this.userParams().maximalAge);
  //   params = params.append('orderBy', this.userParams().orderBy);

  //   console.log('Calling getMembers with params:', params.toString()); // Add this line
  //   return this.getPaginationResult<UserInfo[]>(
  //     this.baseUrl + 'users/infos',
  //     params
  //   );
  // }

  // private getPaginationResult<T>(url: string, params: HttpParams) {
  //   const paginationResult: PaginatedResult<T> = new PaginatedResult<T>();
  //   return this.http.get<T>(url, { observe: 'response', params: params }).pipe(
  //     map((response) => {
  //       if (response.body) {
  //         paginationResult.result = response.body;
  //       }
  //       const pagination = response.headers.get('Pagination');
  //       if (pagination) {
  //         paginationResult.pagination = JSON.parse(pagination);
  //       }
  //       return paginationResult;
  //     })
  //   );
  // }

  // private getPaginationHeaders(pageNumber: number, itemsPerPage: number) {
  //   let params = new HttpParams();
  //   params = params.append('pageNumber', pageNumber);
  //   params = params.append('itemsPerPage', itemsPerPage);

  //   return params;
  // }

  getMember(username: string) {
    return this.http.get<Member>(
      this.baseUrl + 'users/' + username
      // this.getHttpOptions()
    );
  }
  getUserData(username: string) {
    return this.http.get<UserData>(
      this.baseUrl + 'users/data/' + username
      // this.getHttpOptions()
    );
  }
  getMemberbyId(id: string) {
    return this.http.get<Member>(
      this.baseUrl + 'users/get-by-id/' + id
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
