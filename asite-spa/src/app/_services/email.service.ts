import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendEmail(message: any) {
    return this.http.post(this.baseUrl + 'email', message);  }
}
