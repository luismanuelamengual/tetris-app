import classNames from 'classnames';
import { Block, BlockType, ITetrominoType, KeyboardControls, Position, Tetromino } from 'models';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';

interface Props {
  className?: string;
  keyboardControls?: KeyboardControls;
};

export function TetrisBoard({
  className = '',
  keyboardControls = {
    downKeyCode: 'ArrowDown',
    leftKeyCode: 'ArrowLeft',
    rightKeyCode: 'ArrowRight',
    rotateKeyCode: 'ArrowUp'
  }
}: Props) {
  const [blocks] = useState<Array<Block>>([]);
  const [tetrominoBlocks, setTetrominoBlocks] = useState<Array<Block>>([]);
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);
  const [isLeftActionActivated, setLeftActionActivated] = useState(false);
  const [isRightActionActivated, setRightActionActivated] = useState(false);
  const blockCounter = useRef<number>(0);

  useEffect(() => {
    setTetromino({
      type: ITetrominoType,
      position: { x: 4, y: 9 },
      rotationIndex: 0
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
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

  const isAvailableSlot = useCallback(({x, y}: Position): boolean => {
    return !(x < 0 || x > 9 || y > 19 || blocks.find((block) => x === block.position.x && y === block.position.y) !== undefined);
  }, [blocks]);

  const isValidTetromino = useCallback((tetromino: Tetromino): boolean => {
    if (tetromino) {
      const blockOffsets = tetromino.type.shapeOffsets[tetromino.rotationIndex % tetromino.type.shapeOffsets.length];
      return blockOffsets.every(([blockOffsetX, blockOffsetY]) => isAvailableSlot({ x: tetromino.position.x + blockOffsetX, y: tetromino.position.y + blockOffsetY }));
    } else {
      return false;
    }
  }, []);

  const moveTetrominoLeft = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, x: tetromino.position.x - 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
      }
    }
  }, [tetromino]);

  const moveTetrominoRight = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, x: tetromino.position.x + 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
      }
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

  useEffect(() => {
    if (isLeftActionActivated) {
      moveTetrominoLeft();
    }
    if (isRightActionActivated) {
      moveTetrominoRight();
    }
  }, [isLeftActionActivated, isRightActionActivated]);

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case keyboardControls.leftKeyCode: setLeftActionActivated(true); break;
      case keyboardControls.rightKeyCode: setRightActionActivated(true); break;
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case keyboardControls.leftKeyCode: setLeftActionActivated(false); break;
      case keyboardControls.rightKeyCode: setRightActionActivated(false); break;
    }
  };

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {renderTetrominoBlocks()}
    {renderBlocks()}
  </div>;
}