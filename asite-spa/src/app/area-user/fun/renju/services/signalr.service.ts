import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Game, Tile, Move, Invitation, Message } from '../models/models';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  public moveSubject: ReplaySubject<Move> = new ReplaySubject<Move>();
  public activeGamers: string[];

  constructor(private authService: AuthService) {}

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `http://localhost:5000/renju?username=${this.authService.currentUser.userName}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error on starting connection: ' + err));
  }

  public broadcastMove(move: Move) {
    this.hubConnection
      .invoke('broadcastRenjuMove', move)
      .catch((err) => console.error(err));
  }

  public addMoveListener() {
    this.hubConnection.on('broadcastRenjuMove', (move: Move) => {
      this.moveSubject.next(move);
    });
  }

  public getActiveGamers() {
    this.hubConnection.on('activeGamers', (gamers: string[]) => {
      this.activeGamers = gamers;
    });
  }

  public sendInvitation(invitation: Invitation) {
    this.hubConnection
      .invoke('InviteGamer', invitation.to, invitation)
      .catch((err) => console.log(err));
  }

  public gameInvitationListener(): Observable<Invitation> {
    const subj = new Subject<Invitation>();
    this.hubConnection.on('gameInvitation', (invitation) =>
      subj.next(invitation)
    );
    return subj;
  }
  public sendMessage(message: Message) {
    this.hubConnection
      .invoke('sendMessage', message)
      .catch((err) => console.log(err));
  }

  public messageListener(): Observable<Message> {
    const subj = new Subject<Message>();
    this.hubConnection.on('sendMessage', (message) => subj.next(message));
    return subj;
  }
}
