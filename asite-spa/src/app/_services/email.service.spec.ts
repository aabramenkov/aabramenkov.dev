import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

class MockHttpClient {
  post() {}
}

describe('EmailService', () => {
  let service: EmailService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useClass: MockHttpClient }],
    });
    http = TestBed.inject(HttpClient);
    service = TestBed.inject(EmailService);
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#should post request', () => {
    const baseUrl = environment.apiUrl;
    const spy = spyOn(http, 'post');
    service.sendEmail('test message');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(baseUrl + 'email', 'test message');
  });

});
