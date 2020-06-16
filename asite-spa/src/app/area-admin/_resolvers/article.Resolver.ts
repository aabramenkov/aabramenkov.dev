import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ContextService } from 'src/app/_services/context.service';
import { catchError } from 'rxjs/operators';
import { Article } from 'src/app/_models/article.model';


@Injectable()
export class ArticleResolver implements Resolve<Article> {
  constructor(private router: Router, private contextService: ContextService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const articleId: any = route.queryParams.id;
    if (!articleId) {
        const article: Article = {
          id: 0,
          category: '',
          name: '',
          text: '',
        };
        return of(article);
    }
    // tslint:disable-next-line: no-string-literal
    return this.contextService.getArticle(articleId).pipe(
      catchError((error) => {
        this.router.navigate(['/about']);
        return of(null);
      })
    );
  }
}
