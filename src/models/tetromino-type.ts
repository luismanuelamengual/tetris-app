import { BrickType, TetrominoOffsets } from 'models';

export interface TetrominoType {
  brickType: BrickType;
  shapeOffsets: Array<TetrominoOffsets>;
}
