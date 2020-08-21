import { GameState, Message, Game, Tile, Invitation } from './models/models';
export const GAME_HEIGHT = 15;
export const GAME_WIDTH = 15;

export function defaultGameState(): GameState {
  return {
    game: defaultGame(),
    invitation: defaultInvition(),
    chatMessages: new Array<Message>()
  };
}

export function defaultGame(): Game {
  const game = {
    grid: defaultGrid(),
    gameStarted: false,
    gameOver: false,
  };
  return game;
}
function defaultInvition(): Invitation {
  const invitation: Invitation = {
    from: '',
    to: '',
    status: 'inactive',
    initialFigure: 'X',
    sent: Date.now,
  };
  return invitation;
}

function defaultGrid(): Tile[][] {
  const grid: Tile[][] = [];
  for (let i = 0; i < GAME_HEIGHT; i++) {
    grid[i] = [];
    for (let j = 0; j < GAME_WIDTH; j++) {
      grid[i][j] = { i, j, value: '', isWinning: 0 };
    }
  }
  return grid;
}
