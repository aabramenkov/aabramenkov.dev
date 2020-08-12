import { Data } from '@angular/router';

export interface GameState {
  game: Game;
  invitation?: Invitation;
}

export interface Tile {
  i: number;
  j: number;
  value: string;
  isWinning: -1 | 0 | 1;
}

export interface Game {
  grid: Tile[][];
  thisGamer?: Gamer;
  opponentGamer?: Gamer;
  lastMove?: Move;
  gameOver: boolean;
  gameStarted: boolean;
}

export interface Move {
  from: string;
  to: string;
  i: number;
  j: number;
  value: string;
}
export interface Gamer {
  id: number;
  userName: string;
  figure?: string;
}

export interface Invitation {
  from: string;
  to: string;
  status: 'inactive'|'invite' | 'accepted' | 'rejected';
  initialFigure: 'X' | 'O';
  sent: Data;
}

export interface Message {
  from: string;
  to: string;
  sent: Date;
  text: string;
}
