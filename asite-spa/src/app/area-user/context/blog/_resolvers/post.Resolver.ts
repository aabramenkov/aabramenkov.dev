import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Post } from 'src/app/_models/post.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GraphqlService } from '../_services/graphql.service';

@Injectable()
export class PostResolver implements Resolve<Post> {
    constructor(private router: Router, private graphqlService: GraphqlService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const postUrl: string = route.params.url;
        return this.graphqlService.getPost(postUrl);
    }

}
