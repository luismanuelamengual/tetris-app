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
  const moveTetrominoDownRef = useRef<any>();

  const isAvailableSlot = useCallback(({x, y}: Position): boolean => {
    return x >= 0 && x < 10 && y >= 0 && y < 20 && slots[y][x] === null;
  }, [slots]);

  const isValidTetromino = useCallback((tetromino: Tetromino): boolean => {
    return tetromino.type.shapeOffsets[tetromino.rotationIndex]
      .map(([blockOffsetX, blockOffsetY]) => ({ x: tetromino.position.x + blockOffsetX, y: tetromino.position.y + blockOffsetY }))
      .filter(position => position.y >= 0)
      .every(isAvailableSlot);
  }, [isAvailableSlot]);

  const moveTetrominoLeft = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, x: tetromino.position.x - 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
      }
    }
  }, [tetromino, isValidTetromino]);

  const moveTetrominoRight = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, x: tetromino.position.x + 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
      }
    }
  }, [tetromino, isValidTetromino]);

  const rotateTetromino = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, rotationIndex: (tetromino.rotationIndex + 1) % tetromino.type.shapeOffsets.length};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
      }
    }
  }, [tetromino, isValidTetromino]);

  const moveTetrominoDown = useCallback(() => {
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, y: tetromino.position.y + 1 }};
      setTetromino(isValidTetromino(newTetromino)? newTetromino : null);
    }
  }, [tetromino, isValidTetromino]);

  const createBlock = useCallback((type: BlockType, position: Position): Block => {
    return { id: blockCounter.current++, position, type };
  }, []);

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
    moveTetrominoDownRef.current = moveTetrominoDown;
  }, [moveTetrominoDown]);

  useEffect(() => {
    let task: any = null;
    if (!isGameOver) {
      task = setInterval(() => {
        moveTetrominoDownRef.current();
      }, acceleratorPressed ? 50 : 1000);
    }
    return () => {
      if (task != null) {
        clearInterval(task);
      }
    };
  }, [isGameOver, acceleratorPressed]);

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
            const newSlots = [...previousSlots];
            tetrominoBlocks.forEach((block) => {
              if (block.position.y >= 0) {
                newSlots[block.position.y][block.position.x] = block;
              }
            });
            return newSlots;
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

  useEffect(() => {
    const newSlots = [...slots];
    let linesCleared = 0;
    for (let row = 19; row >= 0; row--) {
      if (newSlots[row].every(cell => cell !== null)) {
        newSlots.splice(row, 1);
        newSlots.unshift(Array(10).fill(null));
        linesCleared++;
      }
    }
    if (linesCleared > 0) {
      for (let row = 19; row >= 0; row--) {
        for (let cell = 0; cell <= 9; cell++) {
          const block = newSlots[row][cell];
          if (block != null) {
            block.position = { y: row, x: cell };
          }
        }
      }
      setSlots(newSlots);
    }
  }, [slots]);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {renderTetrominoBlocks()}
    {renderBlocks()}
  </div>;
}