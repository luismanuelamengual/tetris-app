import { BrickType, TetrominoType } from 'models';

const ITetrominoType: TetrominoType = {
  brickType: BrickType.I,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]]
  ]
};

export const TetrominoTypes: Array<TetrominoType> = [
  ITetrominoType
];