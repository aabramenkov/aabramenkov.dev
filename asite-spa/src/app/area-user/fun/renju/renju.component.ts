import { Component, OnInit } from '@angular/core';
import { Tile, Game, Gamer, Move, Invitation, GameState } from './models/models';
import { SignalrService } from './services/signalr.service';
import { HttpService } from './services/http.service';
import { BehaviorSubject, Subject, merge } from 'rxjs';
import { StoreService } from './services/store.service';
import { takeUntil, switchMap, tap, filter } from 'rxjs/operators';
import { ReducersService } from './services/reducers.service';
import { AuthService } from 'src/app/_services/auth.service';

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
    private signalrService: SignalrService,
    private httpService: HttpService,
    private store: StoreService,
    private reducersService: ReducersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signalrService.startConnection(); // TODO
    this.signalrService.addMoveListener(); // TODO

    this.setupGame();
    this.setupGameRender();
    this.running.next(true);
  }

  setupGame() {
    const move$ = this.signalrService.moveSubject.pipe(
      tap((move: Move) => {
        this.store.reduce((state) => this.reducersService.getMoveReducer(state, move));
      })
    );

    const invite$ = this.signalrService.gameInvitationListener().pipe(
      tap((invitation: Invitation) => {
        this.store.reduce((state) => this.reducersService.inviteReducer(state, invitation));
      })
    );

    const gameOver$ = this.store.select(state => state.game.gameOver).pipe(
      filter(gameOver => gameOver),
    );

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
      alert('invate opponent');
      return;
    }
    if (this.state.game.lastMove?.from === this.authService.currentUser.userName) {
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


  getActiveGamers() {
    this.httpService.activeGamers().subscribe((data) => {
      this.activeGamers = data;
      const index = this.activeGamers.indexOf(this.authService.currentUser.userName);
      this.activeGamers[index] = this.activeGamers[index] + ' (this gamer)';
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
    this.state.game.gameOver = false;
  }
}
