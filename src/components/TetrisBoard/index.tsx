import classNames from 'classnames';
import { Block, BlockType, ITetrominoType, Position, Tetromino } from 'models';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';

interface Props {
  className?: string;
};

export function TetrisBoard({ className = '' }: Props) {
  const [blocks] = useState<Array<Block>>([]);
  const [tetrominoBlocks, setTetrominoBlocks] = useState<Array<Block>>([]);
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);
  const blockCounter = useRef<number>(0);

  useEffect(() => {
    setTetromino({
      type: ITetrominoType,
      position: { x: 4, y: 9 },
      rotationIndex: 4
    });
  }, []);

  useEffect(() => {
    if (tetromino === null) {
      setTetrominoBlocks([]);
    } else {
      setTetrominoBlocks((tetrominoBlocks) => {
        const blocks = [...tetrominoBlocks];
        const blockOffsets = tetromino.type.shapeOffsets[tetromino.rotationIndex % tetromino.type.shapeOffsets.length];
        const blockPositions = blockOffsets.map(([blockOffsetX, blockOffsetY]) => ({ x: tetromino.position.x + blockOffsetX, y: tetromino.position.y + blockOffsetY }));
        if (blocks.length === 0) {
          blockPositions.forEach((position) => { blocks.push(createBlock(tetromino.type.blockType, position)); });
        } else {
          blocks.forEach((block, index) => { block.position = blockPositions[index]; });
        }
        return blocks;
      });
    }
  }, [tetromino]);

  const createBlock = useCallback((type: BlockType, position: Position): Block => {
    return { id: blockCounter.current++, position, type };
  }, []);

  const renderBlock = useCallback((block: Block) => {
    return (<div className={classNames({
      'block': true,
      [`block-${block.type}`]: true,
      [`x${block.position.x + 1}`]: true,
      [`y${block.position.y + 1}`]: true,
    })} key={block.id}/>);
  }, []);

  const renderBlocks = useCallback(() => {
    return blocks.length > 0 && blocks.map((block) => renderBlock(block));
  }, [blocks]);

  const renderTetrominoBlocks = useCallback(() => {
    return tetrominoBlocks.length > 0 && tetrominoBlocks.map((block) => renderBlock(block));
  }, [tetrominoBlocks]);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {renderTetrominoBlocks()}
    {renderBlocks()}
  </div>;
}