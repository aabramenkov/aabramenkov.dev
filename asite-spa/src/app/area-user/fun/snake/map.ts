import { Tile, Map, Snake, Food, Game, GameState, Direction } from './models';
import { getInputKey } from './input';

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;

const SNAKE_FOOD_TILE: Tile = {
  isFood: true,
  isSnake: false,
  isSnakeHead: false,
};

const SNAKE_PART_TILE: Tile = {
  isFood: false,
  isSnake: true,
  isSnakeHead: false,
};

const SNAKE_HEAD_TILE: Tile = {
  isFood: false,
  isSnake: false,
  isSnakeHead: true,
};

export function defaultMap(): Map {
  const grid = emptyGrid();
  return {
    grid,
  };
}

function emptyGrid(): Tile[][] {
  return initGrid((i, j) => {
    return { isFood: false, isSnake: false, isSnakeHead: false };
  });
}

function initGrid(setItem: (i: number, j: number) => Tile): Tile[][] {
  const grid: Tile[][] = [];
  for (let i = 0; i < MAP_HEIGHT; i++) {
    grid[i] = [];
    for (let j = 0; j < MAP_WIDTH; j++) {
      grid[i][j] = setItem(i, j);
    }
  }
  return grid;
}

export function updateMap(snake: Snake, food: Food): Map {
  const grid: Tile[][] = emptyGrid();
  grid[food.i][food.j] = SNAKE_FOOD_TILE;

  snake.parts.forEach((element) => {
    grid[element.i][element.j] = SNAKE_PART_TILE;
  });

  grid[snake.head.i][snake.head.j] = SNAKE_HEAD_TILE;

  return {
    grid,
  };
}

export function isInBorders(i: number, j: number): boolean {
  const inBorders = i >= 0 && i < MAP_HEIGHT && j >= 0 && j < MAP_WIDTH;
  return inBorders;
}

export function isSnakeTile(map: Map, i: number, j: number): boolean {
  const tile: Tile = map.grid[i][j];
  return tile.isSnake;
}
function isEmptyTile(map: Map, i: number, j: number): boolean {
  const tile: Tile = map.grid[i][j];
  return !tile.isSnake && !tile.isSnakeHead && !tile.isFood;
}

export function randomFood(game: Game, findNew = true): Food {
  let food = game.food;
  if (findNew) {
    while (true) {
      const i = Math.floor(Math.random() * MAP_HEIGHT);
      const j = Math.floor(Math.random() * MAP_WIDTH);
      if (isEmptyTile(game.map, i, j)) {
        food = { i, j };
        break;
      }
    }
  }
  return food;
}
