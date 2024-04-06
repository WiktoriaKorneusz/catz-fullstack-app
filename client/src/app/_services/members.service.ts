import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { UserInfo } from '../_models/userInfo';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<UserInfo[]>(
      this.baseUrl + 'users/infos'
      // this.getHttpOptions()
    );
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
