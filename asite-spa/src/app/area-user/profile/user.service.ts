import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user.model';

@Injectable()
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, userForUpdate: any) {
    return this.http.post(this.baseUrl + 'users/' + id, userForUpdate);
  }
}
