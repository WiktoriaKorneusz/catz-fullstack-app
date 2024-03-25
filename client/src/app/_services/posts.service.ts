import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { PostDisplay } from '../_models/postDisplay';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<PostDisplay[]>(
      this.baseUrl + 'posts'
      // this.getHttpOptions()
    );
  }

  getPost(id: number) {
    return this.http.get<PostDisplay>(
      this.baseUrl + 'posts/' + id
      // this.getHttpOptions()
    );
  }
}
