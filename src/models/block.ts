import { BlockType, Position } from 'models';

export interface Block {
  id: number;
  type: BlockType;
  position: Position;
  removed: boolean;
}