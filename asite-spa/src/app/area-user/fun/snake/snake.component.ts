import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { GameState, Tile } from './models';
import { BehaviorSubject, Subject, fromEvent, interval, merge } from 'rxjs';
import { StoreService } from './store.service';
import {
  distinctUntilChanged,
  tap,
  filter,
  takeUntil,
  switchMap,
} from 'rxjs/operators';
import { directionReducer, tickReducer } from './snake';
import { AuthService } from 'src/app/_services/auth.service';
import { GamersService, Gamer } from './gamers.service';
import { Router } from '@angular/router';

const TICK_INTERVAL = 150;

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StoreService, GamersService],
})
export class SnakeComponent implements OnInit {
  @HostBinding('class.game-container') gameContainerClass = true;

  public state!: GameState;
  private running = new BehaviorSubject<boolean>(false);
  private unsubscribe$ = new Subject();
  public gamers: Gamer[] = [];
  private currentGamer!: Gamer;

  public get grid(): Tile[][] {
    return this.state.game.map.grid;
  }

  public get isRunning(): boolean {
    return this.running.value;
  }

  constructor(
    private store: StoreService,
    private authService: AuthService,
    private gamersService: GamersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupGame();
    this.setupGameRender();
    this.setupGamer();
    this.setupTopGamersScore();
  }

  setupGamer() {
    if (this.authService.loggedIn) {
      const user = this.authService.currentUser;
      this.currentGamer = {
        id: user?.id ?? 0,
        userName: user?.userName ?? '',
        nickName: user?.nickName ?? '',
        snakeScore: user?.snakeScore ?? 0,
      };
    }
  }

  setupTopGamersScore() {
    this.gamersService.getTopGamers().subscribe((res) => {
      this.gamers = res;
      if (this.authService.loggedIn) {
        const index = this.gamers.findIndex(
          (g) => g.id === this.currentGamer.id
        );
        if (index === -1) {
          this.gamers.push(this.currentGamer);
        }
      }
      this.gamers.push({ id: 2, userName: 'Kate', nickName: 'Kate A.', snakeScore: 5 });
      this.gamers = this.gamers.sort((a, b) => b.snakeScore - a.snakeScore);
      markDirty(this);
    });
  }

  setupGame() {
    const direction$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      distinctUntilChanged(
        (a, b) => a === b,
        (x: KeyboardEvent) => x.code
      ),
      tap((event: KeyboardEvent) =>
        this.store.reduce((state) => directionReducer(state, event))
      )
    );
    const tick$ = interval(TICK_INTERVAL).pipe(
      tap(() => {
        this.store.reduce(tickReducer);
      })
    );

    const game$ = merge(direction$, tick$);

    const gameOver$ = this.store
      .select((state) => state.game.gameOver)
      .pipe(
        filter((gameOver) => gameOver),
        tap(() => this.updateCurrentGamerScore())
      );

    this.running
      .pipe(
        distinctUntilChanged(),
        tap(() => markDirty(this)),
        switchMap((running) => (running ? game$ : [])),
        takeUntil(gameOver$),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  private updateCurrentGamerScore() {
    const gamer = this.gamers.find((g) => g.id === this.currentGamer.id);
    if (!gamer) {
      return;
    }
    if (gamer.snakeScore < this.state.game.snake.length - 3) {
      gamer.snakeScore = this.state.game.snake.length - 3;
      this.gamers.sort((a, b) => b.snakeScore - a.snakeScore);
      this.gamersService.updateGamerScore(gamer.id, gamer.snakeScore).subscribe(
        () => {},
        (err) => console.log(err)
      );
    }
  }

  private setupGameRender() {
    this.store
      .select()
      .pipe(
        filter((state) => state.shouldRender),
        tap((state) => {
          this.state = state;
          markDirty(this);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  public handleStartClick() {
    if (!this.authService.currentUser) {
      this.authService.login(
        'Only registered users can play this game',
        this.router.url
      );
      return;
    }
    this.running.next(true);
  }

  public handlePauseClick() {
    this.running.next(false);
  }

  public handleResetClick() {
    this.running.next(false);
    this.store.reset();
    this.setupGame();
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
