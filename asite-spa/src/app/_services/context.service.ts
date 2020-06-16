import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Article } from '../_models/article.model';
import { Category } from '../_models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ContextService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(this.baseUrl + 'article/' + id);
  }

  getArticlesByCategory(category: string): Observable<Array<Article>> {
    return this.http.get<Array<Article>>(this.baseUrl + 'article/bycategory/' + category);
  }

  updateArticle(id: number, article: Article) {
    return this.http.put(this.baseUrl + 'article/update/' + id, article);
  }

  getCategories() {
    return this.http.get<Category[]>(this.baseUrl + 'category/categories');
  }

}
