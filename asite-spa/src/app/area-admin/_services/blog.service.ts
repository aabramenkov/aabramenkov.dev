import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/_models/post.model';

@Injectable()
export class BlogService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<Post[]>(this.baseUrl + 'posts');
  }

  getPost(id: number) {
    return this.http.get<Post>(this.baseUrl + 'posts/' + id);
  }

  updatePost(id: number, post: Post){
    return this.http.put(this.baseUrl + 'posts/update/' + id, post);
  }
  addPost(post: Post){
    return this.http.post(this.baseUrl + 'posts/add', post);
  }
}
