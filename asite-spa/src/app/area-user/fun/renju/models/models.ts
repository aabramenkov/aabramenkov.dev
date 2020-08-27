import { Data } from '@angular/router';

export interface GameState {
  game: Game;
  invitation?: Invitation;
  chatMessages?: Message[];
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
  nickName: string;
  userName: string;
  figure?: string;
  photoUrl?: string;
}

export interface Invitation {
  from: Gamer;
  to: Gamer;
  status: 'inactive'|'invite' | 'accepted' | 'rejected';
  sent: Data;
}

export interface Message {
  from: Gamer;
  to: Gamer;
  sent: Date;
  text: string;
}
