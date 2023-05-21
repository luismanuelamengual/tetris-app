import { BlockType, TetrominoType } from 'models';

export const ITetrominoType: TetrominoType = {
  blockType: BlockType.I,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]]
  ]
};

export const TetrominoTypes: Array<TetrominoType> = [
  ITetrominoType
];