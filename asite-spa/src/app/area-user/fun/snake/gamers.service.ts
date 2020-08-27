import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class GamersService {

  constructor(private http: HttpClient) { }
  baseUrl = environment.apiUrl;

  getTopGamers(): Observable<Gamer[]> {
    return this.http.get<Gamer[]>(this.baseUrl + 'snake/topsnakers');
  }

  updateGamerScore(userId: number, score: number): Observable<any> {
    return this.http.post(this.baseUrl + `snake/updateScore/?userId=${userId}&score=${score}`, {});
  }

}

export interface Gamer{
  id: number;
  userName: string;
  nickName: string;
  snakeScore: number;
}
