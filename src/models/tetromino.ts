import { Position, TetrominoType } from 'models';

export interface Tetromino {
  type: TetrominoType;
  position: Position;
  rotationIndex: number;
}
