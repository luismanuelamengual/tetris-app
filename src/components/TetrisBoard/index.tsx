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
  const [isGameOver, setIsGameOver] = useState(false);
  const blockCounter = useRef<number>(0);

  useEffect(() => {
    if (!isGameOver) {
      if (tetromino === null) {
        const newTetromino = {
          type: ITetrominoType,
          position: { x: 4, y: 0 },
          rotationIndex: 0
        };
        if (isValidTetromino(newTetromino)) {
          setTetromino(newTetromino);
        } else {
          setIsGameOver(true);
        }
      }
    }
  }, [isGameOver, tetromino]);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const { leftKeyCode, rightKeyCode, rotateKeyCode } = keyboardControls;
      switch (event.code) {
        case leftKeyCode: moveTetrominoLeft(); break;
        case rightKeyCode: moveTetrominoRight(); break;
        case rotateKeyCode: rotateTetromino(); break;
      }
    };
    window.addEventListener('keydown', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyUp);
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
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, x: previousTetromino.position.x - 1 }};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, []);

  const moveTetrominoRight = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, x: previousTetromino.position.x + 1 }};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, []);

  const rotateTetromino = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, rotationIndex: previousTetromino.rotationIndex + 1};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, []);

  /*const moveTetrominoDown = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, y: previousTetromino.position.y + 1 }};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, []);*/

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