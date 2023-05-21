import { TetrominoPosition, TetrominoType } from 'models';

export interface Tetromino {
  type: TetrominoType;
  position: TetrominoPosition;
  rotationIndex: number;
}
