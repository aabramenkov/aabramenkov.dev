const UP_ARR_KEY_CODE = 38;
const RIGHT_ARR_KEY_CODE = 39;
const DOWN_ARR_KEY_CODE = 40;
const LEFT_ARR_KEY_CODE = 37;

const W_KEY_CODE = 87;
const A_KEY_CODE = 65;
const S_KEY_CODE = 83;
const D_KEY_CODE = 68;

const SPACE_KEY_CODE = 32;

// function isUpPressed(keyCode: number) {
//   return keyCode === UP_ARR_KEY_CODE || keyCode === W_KEY_CODE;
// }
// function isLeftPressed(keyCode: number) {
//   return keyCode === LEFT_ARR_KEY_CODE || keyCode === A_KEY_CODE;
// }

// function isRightPressed(keyCode: number) {
//   return keyCode === RIGHT_ARR_KEY_CODE || keyCode === D_KEY_CODE;
// }

// function isDownPressed(keyCode: number) {
//   return keyCode === DOWN_ARR_KEY_CODE || keyCode === S_KEY_CODE;
// }

// function isSpacePressed(keyCode: number) {
//   return keyCode === SPACE_KEY_CODE;
// }

export enum InputKey {
  None = -1,
  Up = 0,
  Left = 1,
  Right = 2,
  Down = 3,
  Space = 4,
}

export function getInputKey(keyCode: number): InputKey {
  let result = InputKey.None;
  switch (keyCode) {
    case UP_ARR_KEY_CODE || W_KEY_CODE: {
      result = InputKey.Up;
      break;
    }
    case DOWN_ARR_KEY_CODE || S_KEY_CODE: {
      result = InputKey.Down;
      break;
    }
    case LEFT_ARR_KEY_CODE || A_KEY_CODE: {
      result = InputKey.Left;
      break;
    }
    case RIGHT_ARR_KEY_CODE || D_KEY_CODE: {
      result = InputKey.Right;
      break;
    }
    case SPACE_KEY_CODE: {
      result = InputKey.Space;
      break;
    }
  }
  return result;
}
