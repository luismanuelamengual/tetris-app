import { BlockType, TetrominoType } from 'models';

export const ITetrominoType: TetrominoType = {
  blockType: BlockType.I,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]]
  ]
};

export const JTetrominoType: TetrominoType = {
  blockType: BlockType.J,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [1, 1]],
    [[0, -1], [0, 0], [0, 1], [-1, 1]],
    [[1, 0], [0, 0], [-1, 0], [-1, -1]],
    [[0, 1], [0, 0], [0, -1], [1, -1]]
  ]
};

export const LTetrominoType: TetrominoType = {
  blockType: BlockType.L,
  shapeOffsets: [
    [[1, 0], [0, 0], [-1, 0], [-1, 1]],
    [[0, 1], [0, 0], [0, -1], [-1, -1]],
    [[-1, 0], [0, 0], [1, 0], [1, -1]],
    [[0, -1], [0, 0], [0, 1], [1, 1]]
  ]
};

export const OTetrominoType: TetrominoType = {
  blockType: BlockType.O,
  shapeOffsets: [
    [[0, 0], [1, 0], [1, 1], [0, 1]]
  ]
};

export const STetrominoType: TetrominoType = {
  blockType: BlockType.S,
  shapeOffsets: [
    [[1, 0], [0, 0], [0, 1], [-1, 1]],
    [[0, 1], [0, 0], [-1, 0], [-1, -1]]
  ]
};

export const ZTetrominoType: TetrominoType = {
  blockType: BlockType.Z,
  shapeOffsets: [
    [[-1, 0], [0, 0], [0, 1], [1, 1]],
    [[0, -1], [0, 0], [-1, 0], [-1, 1]]
  ]
};

export const TTetrominoType: TetrominoType = {
  blockType: BlockType.T,
  shapeOffsets: [
    [[-1, 0], [0, 0], [1, 0], [0, 1]],
    [[0, -1], [0, 0], [0, 1], [-1, 0]],
    [[1, 0], [0, 0], [-1, 0], [0, -1]],
    [[0, 1], [0, 0], [0, -1], [1, 0]]
  ]
};

export const TetrominoTypes: Array<TetrominoType> = [
  ITetrominoType,
  JTetrominoType,
  LTetrominoType,
  OTetrominoType,
  STetrominoType,
  ZTetrominoType,
  TTetrominoType
];