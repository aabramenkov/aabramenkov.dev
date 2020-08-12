import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
private baseApi = 'http://localhost:5000/api/renju/';

  constructor(private http: HttpClient) {
   }

   public activeGamers(): Observable<string[]>{
     return this.http.get<string[]>(this.baseApi + 'gamers');
   }
}
