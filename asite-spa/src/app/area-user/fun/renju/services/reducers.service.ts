import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import {
  GameState,
  Move,
  Game,
  Tile,
  Invitation,
  Message,
  Gamer,
} from '../models/models';
import { GAME_HEIGHT, GAME_WIDTH } from '../renju';
import { MatDialog } from '@angular/material/dialog';
import { AcceptGameInvitationDialogComponent } from '../dialogs/accept-game-invitation-dialog/accept-game-invitation-dialog.component';
import { Observable, of, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { defaultGame } from '../renju';
import { AuthService } from 'src/app/_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReducersService {
  constructor(
    private signalrService: SignalrService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  inviteReducer(
    state: GameState,
    invitation: Invitation
  ): Observable<GameState> {
    const game = { ...state.game };
    switch (invitation.status) {
      case 'invite': {
        const thisGamer: Gamer = { ...this.authService.currentUser, figure: invitation.to.figure} as Gamer;
        const opponentGamer: Gamer = {...invitation.from};
        const inviteResponse: Invitation = {
          ...invitation,
          from: invitation.to,
          to: invitation.from,
          status: 'accepted',
        };
        return this.openDialog(invitation.from).pipe(
          switchMap((result) => {
            inviteResponse.status = result ? 'accepted' : 'rejected';
            const gameStarted: boolean = result;
            this.signalrService.sendInvitation(inviteResponse);
            const newState = {
              ...state,
              game: { ...state.game, thisGamer, opponentGamer, gameStarted },
              invitation: inviteResponse,
              chatMessages: [],
            };
            return of(newState);
          })
        );
        break;
      }
      case 'accepted': {
        const thisGamer: Gamer = invitation.to;
        const opponentGamer: Gamer = invitation.from;
        const gameStarted = true;

        this.alertService.showMessage(
          invitation.from.nickName + ' accepted your invitation. Lets game!'
        );
        const newState = {
          ...state,
          game: { ...state.game, thisGamer, opponentGamer, gameStarted },
          chatMessages: [],
        };
        return of(newState);
        break;
      }
      case 'rejected': {
        game.gameStarted = false;
        this.alertService.showMessage(
          invitation.from + ' declained your invitation. LOL'
        );
        const newState = { ...state, newGame: game };
        return of(newState);
        break;
      }
      default: {
        return of(state);
      }
    }
  }

  getMessageReducer(state: GameState, message: Message): Observable<GameState> {
    if (!state.chatMessages) {
      state.chatMessages = [];
    }
    state.chatMessages.push(message);
    return of(state);
  }

  getMoveReducer(state: GameState, move: Move): Observable<GameState> {
    const grid: Tile[][] = [];
    for (let i = 0; i < GAME_HEIGHT; i++) {
      grid[i] = [];
      for (let j = 0; j < GAME_WIDTH; j++) {
        grid[i][j] = {
          i,
          j,
          value: state.game.grid[i][j].value,
          isWinning: state.game.grid[i][j].isWinning,
        };
      }
    }

    grid[move.i][move.j].value = move.value;
    let game = { ...state.game, grid };
    game = this.updGameIfGameOver(game, move);
    game.lastMove = move;

    const newState = { ...state, game };
    return of(newState);
  }

  public gameOverReducer(state: GameState): Observable<GameState> {
    const game = defaultGame();
    const thisGamer = state.game.thisGamer;
    const opponentGamer = state.game.opponentGamer;
    const newState = { ...state, game: { ...game, thisGamer, opponentGamer } };
    return of(newState);
  }

  private updGameIfGameOver(game: Game, move: Move): Game {
    if (!game.thisGamer) {
      return game;
    }
    const tile = game.grid[move.i][move.j];
    const tiles = this.getBiggestSolidLine(game, tile);
    if (tiles.size >= 5) {
      tiles.forEach((tl) => {
        game.grid[tl.i][tl.j].isWinning =
          game.thisGamer?.nickName === move.from ? 1 : -1;
      });
      game.gameOver = true;
      game.gameStarted = false;
    }
    return game;
  }

  private getBiggestSolidLine(game: Game, tile: Tile): Set<Tile> {
    let tiles: Set<Tile>;
    let tmpSet: Set<Tile>;

    tiles = this.getSolidLine(game, tile, 0, 1);

    tmpSet = this.getSolidLine(game, tile, 1, 0);
    if (tiles.size < tmpSet.size) {
      tiles = tmpSet;
    }

    tmpSet = this.getSolidLine(game, tile, 1, 1);
    if (tiles.size < tmpSet.size) {
      tiles = tmpSet;
    }

    tmpSet = this.getSolidLine(game, tile, -1, 1);
    if (tiles.size < tmpSet.size) {
      tiles = tmpSet;
    }
    return tiles;
  }

  private getSolidLine(
    game: Game,
    tile: Tile,
    dY: number,
    dX: number
  ): Set<Tile> {
    const tiles = new Set<Tile>();
    let y = 0;
    let x = 0;
    let currentTile = tile;
    while (currentTile.value === tile.value) {
      tiles.add(currentTile);

      y++;
      x++;
      if (!this.isInBorder(tile, y, x, dY, dX)) {
        break;
      }
      currentTile = game.grid[tile.i + y * dY][tile.j + x * dX];
    }

    dY = dY * -1;
    dX = dX * -1;
    y = 0;
    x = 0;
    currentTile = tile;
    while (currentTile.value === tile.value) {
      tiles.add(currentTile);

      y++;
      x++;
      if (!this.isInBorder(tile, y, x, dY, dX)) {
        break;
      }
      currentTile = game.grid[tile.i + y * dY][tile.j + x * dX];
    }

    return tiles;
  }

  private isInBorder(
    tile: Tile,
    y: number,
    x: number,
    dY: number,
    dX: number
  ): boolean {
    let result = true;
    if (
      tile.i + y * dY > GAME_HEIGHT - 1 ||
      tile.j + x * dX > GAME_WIDTH - 1 ||
      tile.i + y * dY < 0 ||
      tile.j + x * dX < 0
    ) {
      result = false;
    }
    return result;
  }

  openDialog(gamer: Gamer): Observable<boolean> {
    const dialogRef = this.dialog.open(AcceptGameInvitationDialogComponent, {
      data: gamer,
    });
    return dialogRef.afterClosed();
  }
}
