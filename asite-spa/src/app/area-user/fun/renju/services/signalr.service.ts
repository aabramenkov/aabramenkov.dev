import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Move, Invitation, Message, Tile } from '../models/models';
import { ReplaySubject, Subject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  public moveSubject: ReplaySubject<Move> = new ReplaySubject<Move>();
  public activeGamers: string[] = [];

  constructor() {}

  public get isConnected(): boolean {
    if (this.hubConnection){
      return this.hubConnection?.state !== 0;
    }
    return false;
  }

  public startConnection(currentUserName: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `http://localhost:5000/renju?username=${currentUserName}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .build();

    return this.hubConnection.start();
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

  public broadcastMove(fromGamer: string, toGamer: string, tile: Tile) {
    const move: Move = {
      from: fromGamer,
      to: toGamer,
      i: tile.i,
      j: tile.j,
      value: tile.value,
    };
    this.hubConnection
    .invoke('broadcastRenjuMove', move)
    .catch((err) => console.error(err));

  }

}
