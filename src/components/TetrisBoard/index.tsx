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
  const [slots, setSlots] = useState<Array<Array<Block | null>>>(Array.from({ length: 20 }, () => Array(10).fill(null)));
  const [tetrominoBlocks, setTetrominoBlocks] = useState<Array<Block>>([]);
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [acceleratorPressed, setAcceleratorPressed] = useState<boolean>(false);
  const blockCounter = useRef<number>(0);

  const isAvailableSlot = useCallback(({x, y}: Position): boolean => {
    return !(x < 0 || x > 9 || y > 19 || (y > 0 && slots[y][x] !== null));
  }, [slots]);

  const isValidTetromino = useCallback((tetromino: Tetromino): boolean => {
    const blockOffsets = tetromino.type.shapeOffsets[tetromino.rotationIndex % tetromino.type.shapeOffsets.length];
    return blockOffsets.every(([blockOffsetX, blockOffsetY]) => isAvailableSlot({ x: tetromino.position.x + blockOffsetX, y: tetromino.position.y + blockOffsetY }));
  }, [isAvailableSlot]);

  const moveTetrominoLeft = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, x: previousTetromino.position.x - 1 }};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, [isValidTetromino]);

  const moveTetrominoRight = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, x: previousTetromino.position.x + 1 }};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, [isValidTetromino]);

  const rotateTetromino = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, rotationIndex: previousTetromino.rotationIndex + 1};
        return isValidTetromino(newTetromino)? newTetromino : previousTetromino;
      } else {
        return previousTetromino;
      }
    });
  }, [isValidTetromino]);

  const moveTetrominoDown = useCallback(() => {
    setTetromino((previousTetromino) => {
      if (previousTetromino) {
        const newTetromino = {...previousTetromino, position: {...previousTetromino.position, y: previousTetromino.position.y + 1 }};
        return isValidTetromino(newTetromino)? newTetromino : null;
      } else {
        return previousTetromino;
      }
    });
  }, [isValidTetromino]);

  const createBlock = useCallback((type: BlockType, position: Position): Block => {
    return { id: blockCounter.current++, position, type };
  }, []);

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
  }, [isGameOver, tetromino, isValidTetromino]);

  useEffect(() => {
    let task: any = null;
    if (!isGameOver) {
      task = setInterval(() => {
        moveTetrominoDown();
      }, acceleratorPressed ? 50 : 1000);
    }
    return () => {
      if (task != null) {
        clearInterval(task);
      }
    };
  }, [isGameOver, acceleratorPressed, moveTetrominoDown]);

  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    const { leftKeyCode, rightKeyCode, rotateKeyCode, downKeyCode } = keyboardControls;
    switch (event.code) {
      case leftKeyCode: moveTetrominoLeft(); break;
      case rightKeyCode: moveTetrominoRight(); break;
      case rotateKeyCode: rotateTetromino(); break;
      case downKeyCode: setAcceleratorPressed(true); break;
    }
  }, [moveTetrominoLeft, moveTetrominoRight, rotateTetromino]);

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
    const { downKeyCode } = keyboardControls;
    switch (event.code) {
      case downKeyCode: setAcceleratorPressed(false); break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  useEffect(() => {
    if (tetromino === null) {
      setTetrominoBlocks((tetrominoBlocks) => {
        if (tetrominoBlocks.length > 0) {
          setSlots(previousSlots => {
            tetrominoBlocks.forEach((block) => previousSlots[block.position.y][block.position.x] = block);
            return previousSlots;
          });
        }
        return [];
      });
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
  }, [tetromino, createBlock]);

  const renderBlock = useCallback((block: Block) => {
    return (<div className={classNames({
      'block': true,
      [`block-${block.type}`]: true,
      [`x${block.position.x + 1}`]: true,
      [`y${block.position.y + 1}`]: true,
    })} key={block.id}/>);
  }, []);

  const renderBlocks = useCallback(() => {
    return slots.map((row) => row.map((cell) => cell ? renderBlock(cell) : null));
  }, [slots, renderBlock]);

  const renderTetrominoBlocks = useCallback(() => {
    return tetrominoBlocks.length > 0 && tetrominoBlocks.map((block) => renderBlock(block));
  }, [tetrominoBlocks, renderBlock]);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {renderTetrominoBlocks()}
    {renderBlocks()}
  </div>;
}