import classNames from 'classnames';
import { Block, BlockType, KeyboardControls, Position, Tetromino, TetrominoTypes } from 'models';
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
  const executeGameTickRef = useRef<any>();

  const isAvailableSlot = useCallback(({column, row}: Position): boolean => {
    return column >= 0 && column < 10 && row >= 0 && row < 20 && slots[row][column] === null;
  }, [slots]);

  const isValidTetromino = useCallback((tetromino: Tetromino): boolean => {
    return tetromino.type.shapeOffsets[tetromino.rotationIndex]
      .map(([columnOffset, rowOffset]) => ({ column: tetromino.position.column + columnOffset, row: tetromino.position.row + rowOffset }))
      .filter(position => position.row >= 0)
      .every(isAvailableSlot);
  }, [isAvailableSlot]);

  const spawnTetromino = useCallback((): boolean => {
    const tetrominoType = TetrominoTypes[Math.floor(Math.random() * TetrominoTypes.length)];
    const tetrominoRotationIndex = Math.floor(Math.random() * tetrominoType.shapeOffsets.length);
    const newTetromino = {
      type: tetrominoType,
      position: { column: 4, row: 0 },
      rotationIndex: tetrominoRotationIndex
    };
    let tetrominoSpawned = false;
    if (isValidTetromino(newTetromino)) {
      setTetromino(newTetromino);
      tetrominoSpawned = true;
    }
    return tetrominoSpawned;
  }, [isValidTetromino]);

  const moveTetrominoLeft = useCallback((): boolean => {
    let success = false;
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, column: tetromino.position.column - 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
        success = true;
      }
    }
    return success;
  }, [tetromino, isValidTetromino]);

  const moveTetrominoRight = useCallback((): boolean => {
    let success = false;
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, column: tetromino.position.column + 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
        success = true;
      }
    }
    return success;
  }, [tetromino, isValidTetromino]);

  const rotateTetromino = useCallback((): boolean => {
    let success = false;
    if (tetromino) {
      const newTetromino = {...tetromino, rotationIndex: (tetromino.rotationIndex + 1) % tetromino.type.shapeOffsets.length};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
        success = true;
      }
    }
    return success;
  }, [tetromino, isValidTetromino]);

  const moveTetrominoDown = useCallback((): boolean => {
    let success = false;
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, row: tetromino.position.row + 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
        success = true;
      }
    }
    return success;
  }, [tetromino, isValidTetromino]);

  const freezeTetromino = useCallback(() => {
    if (tetrominoBlocks.length > 0) {
      setSlots(previousSlots => {
        const newSlots = [...previousSlots];
        tetrominoBlocks.filter(block => block.position.row >= 0).forEach((block) => newSlots[block.position.row][block.position.column] = block);
        return newSlots;
      });
    }
    setTetromino(null);
  }, [tetrominoBlocks]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const { leftKeyCode, rightKeyCode, rotateKeyCode, downKeyCode } = keyboardControls;
    switch (event.code) {
      case leftKeyCode: moveTetrominoLeft(); break;
      case rightKeyCode: moveTetrominoRight(); break;
      case rotateKeyCode: rotateTetromino(); break;
      case downKeyCode: setAcceleratorPressed(true); break;
    }
  }, [moveTetrominoLeft, moveTetrominoRight, rotateTetromino]);

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    const { downKeyCode } = keyboardControls;
    switch (event.code) {
      case downKeyCode: setAcceleratorPressed(false); break;
    }
  }, []);

  const createBlock = useCallback((type: BlockType, position: Position): Block => {
    return { id: blockCounter.current++, position, type };
  }, []);

  const renderBlock = useCallback((block: Block) => {
    return (<div className={classNames({
      'block': true,
      [`block-${block.type}`]: true,
      [`x${block.position.column + 1}`]: true,
      [`y${block.position.row + 1}`]: true,
    })} key={block.id}/>);
  }, []);

  const renderBlocks = useCallback(() => {
    return slots.map((row) => row.map((cell) => cell ? renderBlock(cell) : null));
  }, [slots, renderBlock]);

  const renderTetrominoBlocks = useCallback(() => {
    return tetrominoBlocks.length > 0 && tetrominoBlocks.map((block) => renderBlock(block));
  }, [tetrominoBlocks, renderBlock]);

  const executeGameTick = useCallback(() => {
    if (!isGameOver) {
      if (tetromino === null) {
        if (!spawnTetromino()) {
          setIsGameOver(true);
        }
      } else {
        if (!moveTetrominoDown()) {
          freezeTetromino();
        }
      }
    }
  }, [isGameOver, tetromino, isValidTetromino, moveTetrominoDown, freezeTetromino]);

  useEffect(() => {
    executeGameTickRef.current = executeGameTick;
  }, [executeGameTick]);

  useEffect(() => {
    let task: any = null;
    if (!isGameOver) {
      task = setInterval(() => {
        executeGameTickRef.current();
      }, acceleratorPressed ? 50 : 1000);
    }
    return () => {
      if (task != null) {
        clearInterval(task);
      }
    };
  }, [isGameOver, acceleratorPressed]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  useEffect(() => {
    if (tetromino === null) {
      setTetrominoBlocks([]);
    } else {
      setTetrominoBlocks((tetrominoBlocks) => {
        const blocks = [...tetrominoBlocks];
        const positions = tetromino.type.shapeOffsets[tetromino.rotationIndex]
          .map(([columnOffset, rowOffset]) => ({ column: tetromino.position.column + columnOffset, row: tetromino.position.row + rowOffset }));
        if (blocks.length === 0) {
          positions.forEach((position) => { blocks.push(createBlock(tetromino.type.blockType, position)); });
        } else {
          blocks.forEach((block, index) => { block.position = positions[index]; });
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
        for (let column = 0; column <= 9; column++) {
          const block = newSlots[row][column];
          if (block != null) {
            block.position = { row, column };
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