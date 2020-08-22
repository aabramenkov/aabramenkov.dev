import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Gamer } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
private baseApi = 'http://localhost:5000/api/renju/';

  constructor(private http: HttpClient) {
   }

   public activeGamers(): Observable<Gamer[]>{
    return this.http.get<Gamer[]>(this.baseApi + 'allgamers');
   }
}
