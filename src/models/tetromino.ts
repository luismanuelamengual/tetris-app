import { BrickType } from './brick-type';

export interface Tetromino {
  brickType: BrickType;
  shapeOffsets: Array<Array<[number, number]>>;
}

export const ITetromino: Tetromino = {
  brickType: BrickType.I,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]]
  ]
};
