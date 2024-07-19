import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { PostDisplay } from '../_models/postDisplay';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserPost } from '../_models/userPost';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<UserPost[]> | null>(null);

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<PostDisplay[]>(
      this.baseUrl + 'posts'
      // this.getHttpOptions()
    );
  }

  // getMessages(pageNumber: number, pageSize: number, type: string) {
  //   let params = setPaginationHeaders(pageNumber, pageSize);

  //   params = params.append('type', type);

  //   return this.http
  //     .get<Message[]>(this.baseUrl + 'messages', {
  //       observe: 'response',
  //       params,
  //     })
  //     .subscribe({
  //       next: (response) =>
  //         setPaginatedResponse(response, this.paginatedResult),
  //     });
  // }

  getUserPosts(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    userId: number
  ) {
    let params = setPaginationHeaders(pageNumber, pageSize, searchTerm);
    return this.http
      .get<UserPost[]>(this.baseUrl + 'posts/user/' + userId, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  getPost(id: number) {
    return this.http.get<PostDisplay>(
      this.baseUrl + 'posts/' + id
      // this.getHttpOptions()
    );
  }

  updatePost(id: number, post: PostDisplay) {
    return this.http.put<PostDisplay>(
      this.baseUrl + 'posts/' + id,
      post
      // this.getHttpOptions()
    );
  }

  addPost(post: PostDisplay, files: FileList) {
    const formData = new FormData();
    formData.append('content', post.content);
    Array.from(files).forEach((file) => {
      formData.append('photos', file, file.name);
    });

    return this.http.post(this.baseUrl + 'posts/add-post', formData);
  }

  deletePost(id: number) {
    return this.http.delete(this.baseUrl + 'posts/delete-post/' + id);
  }

  // addPhoto(id: number, file: File) {

  addPhoto(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.baseUrl + 'posts/add-photo/' + id, formData);
  }

  deletePhoto(postId: number, photoId: number) {
    return this.http.delete(
      this.baseUrl + 'posts/delete-photo/' + postId + '/' + photoId
    );
  }
}
