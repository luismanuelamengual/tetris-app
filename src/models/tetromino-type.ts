import { BlockType, TetrominoOffsets } from 'models';

export interface TetrominoType {
  blockType: BlockType;
  shapeOffsets: Array<TetrominoOffsets>;
}
