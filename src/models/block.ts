import { BlockType, Position } from 'models';

export interface Block {
  id: string|number;
  type: BlockType;
  position: Position;
}