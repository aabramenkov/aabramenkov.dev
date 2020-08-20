import { Game, Direction, GameState, Snake, Food, SnakePart } from './models';
import { updateMap, isInBorders, randomFood } from './map';
import { InputKey, getInputKey } from './input';

export function defaultGameState(): GameState {
  return {
    game: defaultGame(),
    directions: [Direction.Right],
    shouldRender: true,
  };
}

function defaultGame(): Game {
  const snake = defaultSnake();
  const food = defaultFood();
  const map = updateMap(snake, food);
  const gameOver = false;
  return { snake, map, food, gameOver };
}

function defaultSnake(): Snake {
  const parts = [
    { i: 0, j: 0 },
    { i: 0, j: 1 },
    { i: 0, j: 2 },
  ];
  return {
    direction: Direction.Right,
    head: parts[parts.length - 1],
    length: parts.length,
    parts,
    foodEaten: false,
  };
}
function defaultFood(): Food {
  return { i: 0, j: 10 };
}

function validNextDirection(curr: Direction, next: Direction): boolean {
  let result = false;
  if (next !== Direction.None) {
    switch (curr) {
      case Direction.Down: {
        result = next !== Direction.Up;
        break;
      }
      case Direction.Up: {
        result = next !== Direction.Down;
        break;
      }
      case Direction.Left: {
        result = next !== Direction.Right;
        break;
      }
      case Direction.Right: {
        result = next !== Direction.Left;
        break;
      }
      default: {
        result = false;
      }
    }
  }
  return result;
}

function getNewHead(snake: Snake): SnakePart {
  const head = snake.head;
  let newHead: SnakePart;
  switch (snake.direction) {
    case Direction.Down: {
      newHead = { i: head.i + 1, j: head.j };
      break;
    }
    case Direction.Up: {
      newHead = { i: head.i - 1, j: head.j };
      break;
    }
    case Direction.Left: {
      newHead = { i: head.i, j: head.j - 1 };
      break;
    }
    case Direction.Right: {
      newHead = { i: head.i, j: head.j + 1 };
      break;
    }
    default: {
      return head;
    }
  }
  return newHead;
}

function moveToDirection(snake: Snake, direction: Direction): Snake {
  if (validNextDirection(snake.direction, direction)) {
    snake = {
      ...snake,
      direction,
    };
  }

  const newHead = getNewHead(snake);
  snake.parts = [...snake.parts, newHead];

  return {
    ...snake,
    head: newHead,
    parts: snake.parts,
    length: snake.parts.length,
  };
}

function snakeFoodEaten(snake: Snake, food: Food): Snake {
  const foodEaten = snake.head.i === food.i && snake.head.j === food.j;
  let parts = snake.parts;
  const [tail, ...rest] = snake.parts;
  if (!foodEaten) {
    parts = rest;
  }

  return {
    ...snake,
    foodEaten,
    parts,
    length: parts.length,
  };
}

function isGameOver(game: Game): boolean {
  const {
    snake,
    snake: { head },
  } = game;
  return (
    !isInBorders(head.i, head.j) ||
    snake.parts.some(
      (part) => part !== head && part.i === head.i && part.j === head.j
    )
  );
}

function tick(game: Game, direction: Direction): Game {
  game = { ...game, snake: moveToDirection(game.snake, direction) };
  game = { ...game, snake: snakeFoodEaten(game.snake, game.food) };
  game = { ...game, food: randomFood(game, game.snake.foodEaten) };
  game = { ...game, gameOver: isGameOver(game) };
  if (!game.gameOver) {
    game = { ...game, map: updateMap(game.snake, game.food) };
  }
  return game;
}
export function tickReducer(state: GameState): GameState {
  const [curDirection, nextDirection, ...rest] = state.directions;
  let direction = curDirection;
  if (nextDirection !== undefined) {
    direction = nextDirection;
  }
  const directions =
    state.directions.length === 1 ? state.directions : [nextDirection, ...rest];
  const game = tick(state.game, direction);
  return {
    ...state,
    game,
    directions,
    shouldRender: true,
  };
}

function inputToDirection(inputKey: InputKey): Direction {
  let res: Direction = Direction.None;
  switch (inputKey) {
    case InputKey.Left:
      res = Direction.Left;
      break;
    case InputKey.Right:
      res = Direction.Right;
      break;
    case InputKey.Down:
      res = Direction.Down;
      break;
    case InputKey.Up:
      res = Direction.Up;
      break;
  }
  return res;
}

function getDirection(event: KeyboardEvent): Direction {
  // tslint:disable-next-line: deprecation
  const inputKey = getInputKey(event.keyCode);
  const newDirection = inputToDirection(inputKey);
  return newDirection;
}

export function directionReducer(
  state: GameState,
  event: KeyboardEvent
): GameState {
  let result = state;
  const newDirection = getDirection(event);
  if (newDirection !== Direction.None) {
    result = {
      ...state,
      directions: [...state.directions, newDirection],
      shouldRender: false,
    };
  }
  return result;
}

export function renderConsole(state: GameState) {
  if (state.shouldRender) {
    const map = state.game.map;
    const strGrid = map.grid
      .map((row) =>
        row
          .map((item) =>
            item.isSnakeHead
              ? '@'
              : item.isSnake
              ? 'x'
              : item.isFood
              ? '*'
              : '.'
          )
          .join(' ')
      )
      .join('\n');
    console.log(strGrid + '\n');
  }
}
