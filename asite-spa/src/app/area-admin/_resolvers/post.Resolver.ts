import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Post } from 'src/app/_models/post.model';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { BlogService } from '../_services/blog.service';
import { AuthService } from 'src/app/_services/auth.service';

@Injectable()
export class PostResolver implements Resolve<Post> {
  constructor(
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const currentUser = this.authService.currentUser;
    if (!currentUser){
      return EMPTY;
    }
    const postId: string = route.queryParams.id;
    if (!postId) {
      const post: Post = {
        id: 0,
        title: '',
        description: '',
        text: '',
        created: new Date(),
        updated: new Date(),
        published: false,
        deleted: false,
        user: currentUser,
        userId: currentUser.id,
        url: '',
        comments: []
      };
      return of(post);
    }
    return this.blogService.getPost(Number(postId));
  }
}
