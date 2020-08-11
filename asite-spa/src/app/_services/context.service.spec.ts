import { TestBed } from '@angular/core/testing';

import { ContextService } from './context.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpResponse } from '@angular/common/http';

describe('ContextService', () => {
  let service: ContextService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ContextService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test getArticle', () => {
    const article = {
      id: 1,
      category: 'category',
      shortDescription: 'shortDescription',
      name: 'name',
      title: 'title',
      subtitle: 'subtitle',
      text: 'text',
    };
    service
      .getArticle(1)
      .subscribe((response) => expect(response).toBe(article));
    const req = httpTestingController.expectOne(
      environment.apiUrl + 'article/' + 1
    );
    expect(req.request.method).toBe('GET');
    req.flush(article);
  });

  it('test getArticlesByCategory', () => {
    const articles = [
      {
        id: 1,
        category: 'category',
        shortDescription: 'shortDescription',
        name: 'name',
        title: 'title',
        subtitle: 'subtitle',
        text: 'text',
      },
    ];

    service
      .getArticlesByCategory('category')
      .subscribe((response) => expect(response).toBe(articles));

    const req = httpTestingController.expectOne(
      environment.apiUrl + 'article/bycategory/' + 'category'
    );
    expect(req.request.method).toBe('GET');
    req.flush(articles);
  });

  it('test updateArticle', () => {
    const article = {
      id: 1,
      category: 'category',
      shortDescription: 'shortDescription',
      name: 'name',
      title: 'title',
      subtitle: 'subtitle',
      text: 'text',
    };

    service
      .updateArticle(1, article)
      .subscribe((response) => expect(response).toEqual(article, 'should return article'));

    const req = httpTestingController.expectOne(
        environment.apiUrl + 'article/update/' + 1
    );
    expect (req.request.method).toBe('PUT');
    expect (req.request.body).toBe(article);
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: article });
    req.event(expectedResponse);
  });

  it('getCategories', () => {
      const categiries = [{
        id: 1,
        name: 'name'
      }];

      service.getCategories().subscribe(response => expect(response).toBe(categiries));

      const req = httpTestingController.expectOne(environment.apiUrl + 'category/categories');
      expect(req.request.method).toBe('GET');
      req.flush(categiries);
  });
});
