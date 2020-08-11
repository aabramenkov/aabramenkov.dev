export interface SnakePart{
    i: number;
    j: number;
}

export interface Snake{
    head: SnakePart;
    parts: SnakePart[];
    direction: Direction;
    length: number;
    foodEaten: boolean;
}

export enum Direction{
    None = -1,
    Up = 0,
    Left = 1,
    Right = 2,
    Down = 3
}

export interface Food{
    i: number;
    j: number;
}

export interface Tile{
    isFood: boolean;
    isSnake: boolean;
    isSnakeHead: boolean;
}
export interface Map{
    grid: Tile[][];
}

export interface Game{
    snake: Snake;
    food: Food;
    map: Map;
    gameOver: boolean;
}

export interface GameState{
    game: Game;
    directions: Direction[];
    shouldRender: boolean;
}

