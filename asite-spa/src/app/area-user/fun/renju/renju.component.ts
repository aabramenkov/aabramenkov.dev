import { Component, OnInit } from '@angular/core';
import {
  Tile,
  Game,
  Gamer,
  Move,
  Invitation,
  GameState,
  Message,
} from './models/models';
import { SignalrService } from './services/signalr.service';
import { HttpService } from './services/http.service';
import { BehaviorSubject, Subject, merge, pipe, of } from 'rxjs';
import { StoreService } from './services/store.service';
import { takeUntil, switchMap, tap, filter, map } from 'rxjs/operators';
import { ReducersService } from './services/reducers.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertService } from './services/alert.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InviteGamerDialogComponent } from './dialogs/invite-gamer-dialog/invite-gamer-dialog.component';
import { defaultGameState } from './renju';

@Component({
  selector: 'app-renju',
  templateUrl: './renju.component.html',
  styleUrls: ['./renju.component.scss'],
})
export class RenjuComponent implements OnInit {
  public state: GameState = defaultGameState();
  private running = new BehaviorSubject<boolean>(false);
  private unsubscribe$ = new Subject();
  private gameOver$ = new BehaviorSubject<boolean>(false);

  public get grid(): Tile[][] {
    return this.state.game.grid;
  }

  constructor(
    public authService: AuthService,
    private signalrService: SignalrService,
    private httpService: HttpService,
    private store: StoreService,
    private reducersService: ReducersService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupGameRender();
  }

  public get isConnected(): boolean {
    return this.signalrService.isConnected;
  }

  private setupGame() {
    this.state.game.thisGamer = this.authService.currentUser as Gamer;
    const move$ = this.signalrService.moveSubject.pipe(
      tap((move: Move) => {
        this.store.reduce((state) =>
          this.reducersService.getMoveReducer(state, move)
        );
      })
    );

    const invite$ = this.signalrService.gameInvitationListener().pipe(
      tap((invitation: Invitation) => {
        this.store.reduce((state) =>
          this.reducersService.inviteReducer(state, invitation)
        );
      })
    );

    const message$ = this.signalrService.messageListener().pipe(
      tap((message: Message) => {
        this.store.reduce((state) =>
          this.reducersService.getMessageReducer(state, message)
        );
      })
    );

    const gOver$ =  this.gameOver$.pipe(
      filter((gameOver) => gameOver),
      tap(() => {
        console.log('in this.gameOver$.pipe');
        this.store.reduce((state) =>
          this.reducersService.gameOverReducer(state)
        );
      })
    );

    const game$ = merge(invite$, move$, message$, gOver$);

    this.running
      .pipe(
        switchMap((running) => (running ? game$ : [])),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  private setupGameRender() {
    this.store
      .select()
      .pipe(
        tap((state) => {
          this.state = state;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  clickTile(i: number, j: number) {
    if (!this.isMoveCorrect(i, j)) {
      return;
    }
    if (!this.state.game.thisGamer || !this.state.game.opponentGamer) {
      return;
    }

    const tile: Tile = {
      ...this.state.game.grid[i][j],
      value: this.state.game.thisGamer?.figure ?? 'X',
    };
    const thisGamerName = this.state.game.thisGamer.userName;
    const opponentGamerName = this.state.game.opponentGamer.userName;

    this.signalrService.broadcastMove(thisGamerName, opponentGamerName, tile);
  }

  private isMoveCorrect(i: number, j: number): boolean {
    if (!this.state.game.opponentGamer) {
      this.alertService.showMessage('Invate opponent');
      return false;
    }
    if (!this.state.game.gameStarted){
      this.alertService.showMessage('Invite opponent to start game.');
      return false;
    }
    if (
      this.state.game.lastMove?.from === this.authService.currentUser?.userName
    ) {
      this.alertService.showMessage('you should wait partners move');
      return false;
    }
    if (this.state.game.grid[i][j].value !== '') {
      return false;
    }
    if (
      !this.state.game.lastMove &&
      this.state.game.thisGamer?.figure === 'O'
    ) {
      this.alertService.showMessage('No no no.  First move not on your side.');
      return false;
    }
    return true;
  }

  inviteOpponent() {
    this.httpService
      .activeGamers()
      .pipe(
        map((data) => {
          const activeGamers = data;
          // const index = activeGamers.indexOf(
          //   this.authService.currentUser?.userName ?? ''
          // );
          // activeGamers.splice(index, 1);
          return activeGamers;
        }),
        switchMap((activeGamers) => {
          const dialogRef = this.dialog.open(InviteGamerDialogComponent, {
            data: { activeGamers},
          });
          return dialogRef.afterClosed();
        })
      )
      .subscribe((gamer: Gamer) => {
        this.inviteGamer(gamer);
      });
  }

  inviteGamer(gamer: Gamer) {
    if (!this.authService.currentUser) {
      return;
    }
    const invitation: Invitation = {
      from: {userName: this.authService.currentUser.userName, photoUrl:this.authService.currentUser.photoUrl},
      to: gamer,
      status: 'invite',
      initialFigure: 'X',
      sent: Date.now,
    };
    this.signalrService.sendInvitation(invitation);
  }

  handleGameOverClick() {
    console.log('handleGameOverClick');
    this.gameOver$.next(true);
  }

  registerInGame() {
    if (!this.authService.loggedIn) {
      this.authService.login(
        'Please register if you want to play game',
        this.router.url
      );
      return;
    }
    if (!this.authService.currentUser) {
      return;
    }
    if (!this.signalrService.isConnected) {
      this.signalrService.startConnection(
        this.authService.currentUser.userName
      );
      this.signalrService.addMoveListener();
      this.setupGame();
      this.running.next(true);
      return;
    }
  }

  sendMessage(msgText: string) {
    if (!this.state.game.thisGamer || !this.state.game.opponentGamer){
      return;
    }
    const message: Message = {
      from: this.state.game.thisGamer,
      to: this.state.game.opponentGamer,
      sent: new Date(),
      text: msgText,
    };
    this.signalrService.sendMessage(message);
  }
}
