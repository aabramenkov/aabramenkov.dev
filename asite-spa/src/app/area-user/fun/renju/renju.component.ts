import { Component, OnInit } from '@angular/core';
import {
  Tile,
  Game,
  Gamer,
  Move,
  Invitation,
  GameState,
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

@Component({
  selector: 'app-renju',
  templateUrl: './renju.component.html',
  styleUrls: ['./renju.component.scss'],
})
export class RenjuComponent implements OnInit {
  public state: GameState;
  private running = new BehaviorSubject<boolean>(false);
  private unsubscribe$ = new Subject();

  public activeGamers: string[];

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

public get isConnected(): boolean{
  return this.signalrService.isConnected;
}

  setupGame() {
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

    const gameOver$ = this.store
      .select((state) => state.game.gameOver)
      .pipe(filter((gameOver) => gameOver));

    const game$ = merge(invite$, move$);

    this.running
      .pipe(
        switchMap((running) => (running ? game$ : [])),
        takeUntil(gameOver$),
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

    if (!this.state.game.opponentGamer) {
      this.alertService.showMessage('Invate opponent');
      return;
    }
    if (
      this.state.game.lastMove?.from === this.authService.currentUser.userName
    ) {
      alert('you should wait partners move');
      return;
    }
    if (this.state.game.grid[i][j].value !== '') {
      return;
    }
    const tile = {
      ...this.state.game.grid[i][j],
      value: this.state.game.thisGamer.figure,
    };

    this.reducersService.sendMoveReducer(this.state, tile);
  }


  inviteOpponent() {
    this.httpService
      .activeGamers()
      .pipe(
        map((data) => {
          const activeGamers = data;
          const index = activeGamers.indexOf(
            this.authService.currentUser.userName
          );
          activeGamers.splice(index, 1);
          return activeGamers;
        }),
        switchMap((acitveGamers) => {
          const dialogRef = this.dialog.open(InviteGamerDialogComponent, {
            data: { activeGamers: acitveGamers },
          });
          return dialogRef.afterClosed();
        })
      )
      .subscribe((gamer) => {
        this.inviteGamer(gamer);
      });
  }

  inviteGamer(gamer: string) {
    const invitation: Invitation = {
      from: this.authService.currentUser.userName,
      to: gamer,
      status: 'invite',
      initialFigure: 'X',
      sent: Date.now,
    };
    this.signalrService.sendInvitation(invitation);
  }

  handleResetClick() {
    this.store.reset();
  }

  registerInGame(){
    if (!this.authService.loggedIn) {
      this.authService.login(
        'Please register if you want to play game',
        this.router.url
      );
      return;
    }
    if (!this.signalrService.isConnected) {
      this.signalrService.startConnection();
      this.signalrService.addMoveListener();
      this.setupGame();
      this.running.next(true);
      return;
    }
  }
}
