import classNames from 'classnames';
import { Block, ITetrominoType, Tetromino } from 'models';
import { useCallback, useEffect, useState } from 'react';
import './index.scss';

interface Props {
  className?: string;
};

export function TetrisBoard({ className = '' }: Props) {
  const [blocks] = useState<Array<Block>>([]);
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);

  useEffect(() => {
    setTetromino({
      type: ITetrominoType,
      position: { x: 9, y: 14 },
      rotationIndex: 1
    });
  }, []);

  const renderBlock = (block: Block) => {
    return (<div className={classNames({
      'block': true,
      [`block-${block.type}`]: true,
      [`x${block.position.x + 1}`]: true,
      [`y${block.position.y + 1}`]: true,
    })} key={block.id}/>);
  };

  const renderBlocks = useCallback(() => {
    return blocks.map((block) => renderBlock(block));
  }, [blocks]);

  const renderTetromino = useCallback(() => {
    if (!tetromino) {
      return null;
    }
    const blockOffsets = tetromino.type.shapeOffsets[tetromino.rotationIndex];
    return blockOffsets.map(([blockOffsetX, blockOffsetY], index) => renderBlock({
      id: `tetromino-${index}`,
      position: { x: tetromino.position.x + blockOffsetX, y: tetromino.position.y + blockOffsetY },
      type: tetromino.type.blockType
    }));
  }, [tetromino]);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {renderTetromino()}
    {renderBlocks()}
  </div>;
}