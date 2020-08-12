import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { GameState, Move, Game, Tile, Invitation } from '../models/models';
import { GAME_HEIGHT, GAME_WIDTH } from '../renju';
import { MatDialog } from '@angular/material/dialog';
import { AcceptGameInvitationDialogComponent } from '../dialogs/accept-game-invitation-dialog/accept-game-invitation-dialog.component';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReducersService {
  constructor(private signalrService: SignalrService, public dialog: MatDialog) {}

  inviteReducer(state: GameState, invitation: Invitation): Observable<GameState> {
      switch (invitation.status) {
        case 'invite': {
          state.game.thisGamer = {
            id: 2,
            userName: invitation.to,
            figure: 'O',
          };
          state.game.opponentGamer = {
            id: 1,
            userName: invitation.from,
            figure: 'X',
          };
          const inviteResponse: Invitation = {
            ...invitation,
            from: invitation.to,
            to: invitation.from,
            status: 'accepted',
          };
          return this.openDialog(invitation.from).pipe(switchMap((result) => {
            state.invitation = inviteResponse;
            state.invitation.status = result ? 'accepted' : 'rejected';
            state.game.gameStarted = result;
            this.signalrService.sendInvitation(state.invitation);
            return of(state);
          }));
          break;
        }
        case 'accepted': {
          state.game.thisGamer = {
            id: 1,
            userName: invitation.to,
            figure: 'X',
          };
          state.game.opponentGamer = {
            id: 2,
            userName: invitation.from,
            figure: 'O',
          };
          state.game.gameStarted = true;
          alert('user accepted your invitation');
          return of(state);
          break;
        }
        case 'rejected': {
          state.game.gameStarted = false;
          alert('user rejected your game invitation!');
          return of(state);
          break;
        }
      }
    }


  sendMoveReducer(state: GameState, tile: Tile): Observable<GameState> {
    const move: Move = {
      from: state.game.thisGamer.userName,
      to: state.game.opponentGamer.userName,
      i: tile.i,
      j: tile.j,
      value: tile.value,
    };

    this.signalrService.broadcastMove(move);
    return of(state);
  }

  getMoveReducer(state: GameState, move: Move): Observable<GameState> {
    let game = state.game;

    game.grid[move.i][move.j].value = move.value;

    game = this.updGameIfGameOver(game, move);
    game.lastMove = move;

    const newState = { ...state, game };
    return of(newState);
  }

  private updGameIfGameOver(game: Game, move: Move): Game {
    const tile = game.grid[move.i][move.j];
    const tiles = this.getBiggestSolidLine(game, tile);
    if (tiles.size >= 5) {
      const newGame = game;
      tiles.forEach((tl) => {
        newGame.grid[tl.i][tl.j].isWinning = game.thisGamer.userName === move.from ? 1 : -1;
      });
      newGame.gameOver = true;
      return newGame;
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

  openDialog(userName: string): Observable<boolean> {
    const dialogRef = this.dialog.open(AcceptGameInvitationDialogComponent, {
      data: { userName },
    });
    return dialogRef.afterClosed();
  }
}
