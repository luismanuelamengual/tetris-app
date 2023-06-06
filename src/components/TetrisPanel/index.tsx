import { playSound } from 'actions';
import classNames from 'classnames';
import { Block, BlockType, KeyboardControls, Position, Sound, Tetromino, TetrominoTypes } from 'models';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';

interface Props {
  className?: string;
  keyboardControls?: KeyboardControls;
  onGameover?: (result: { level: number, lines: number, score: number }) => void
};

const LEVEL_POINTS_PER_LEVEL = 20;
const ACCELERATED_INTERVAL = 50;
const INTERVAL_PER_LEVEL = [ 1000, 900, 800, 700, 600, 500, 450, 400, 350, 300, 250, 200, 180, 160, 140, 120, 100, 80, 70, 60 ];
const SCORE_ACCELERATED_MOVE = 1;
const SCORE_ONE_LINE_CLEARED = 100;
const SCORE_TWO_LINES_CLEARED = 300;
const SCORE_THREE_LINES_CLEARED = 500;
const SCORE_FOUR_LINES_CLEARED = 800;

export function TetrisPanel({
  className = '',
  keyboardControls = {
    downKeyCode: 'ArrowDown',
    leftKeyCode: 'ArrowLeft',
    rightKeyCode: 'ArrowRight',
    rotateKeyCode: 'ArrowUp'
  },
  onGameover = () => null
}: Props) {
  const [slots, setSlots] = useState<Array<Array<Block | null>>>(Array.from({ length: 20 }, () => Array(10).fill(null)));
  const [tetrominoBlocks, setTetrominoBlocks] = useState<Array<Block>>([]);
  const [nextTetromino, setNextTetromino] = useState<Tetromino | null>(null);
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [acceleratorPressed, setAcceleratorPressed] = useState<boolean>(false);
  const [levelPointsCounter, setLevelPointsCounter] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
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

  const createTetromino = useCallback((): Tetromino => {
    const tetrominoType = TetrominoTypes[Math.floor(Math.random() * TetrominoTypes.length)];
    const tetrominoRotationIndex = Math.floor(Math.random() * tetrominoType.shapeOffsets.length);
    return {
      type: tetrominoType,
      position: { column: 4, row: 0 },
      rotationIndex: tetrominoRotationIndex
    };
  }, []);

  const spawnTetromino = useCallback((): boolean => {
    let tetrominoSpawned = false;
    if (nextTetromino !== null) {
      if (isValidTetromino(nextTetromino)) {
        setNextTetromino(createTetromino());
        setTetromino(nextTetromino);
        tetrominoSpawned = true;
      }
    } else {
      const newTetromino = createTetromino();
      if (isValidTetromino(newTetromino)) {
        setNextTetromino(createTetromino());
        setTetromino(newTetromino);
        tetrominoSpawned = true;
      }
    }
    return tetrominoSpawned;
  }, [nextTetromino, isValidTetromino]);

  const moveTetrominoLeft = useCallback((): boolean => {
    let success = false;
    if (tetromino) {
      const newTetromino = {...tetromino, position: {...tetromino.position, column: tetromino.position.column - 1 }};
      if (isValidTetromino(newTetromino)) {
        setTetromino(newTetromino);
        success = true;
      } else {
        playSound(Sound.ILLEGAL_MOVE);
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
      } else {
        playSound(Sound.ILLEGAL_MOVE);
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
      } else {
        playSound(Sound.ILLEGAL_MOVE);
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
    return { id: blockCounter.current++, position, type, removed: false };
  }, []);

  const renderBlock = useCallback((block: Block) => {
    const { column, row } = block.position;
    if (row < 0 || row >= 20 || column < 0 || column >= 10) {
      return null;
    }
    return (<div className={classNames({
      'block': true,
      'block-flashing': block.removed,
      'block-disabled': isGameOver,
      [`block-${block.type}`]: true,
      [`x${column + 1}`]: true,
      [`y${row + 1}`]: true,
    })} key={block.id}/>);
  }, [isGameOver]);

  const renderBlocks = useCallback(() => {
    return slots.map((row) => row.map((cell) => cell ? renderBlock(cell) : null));
  }, [slots, renderBlock]);

  const renderTetrominoBlocks = useCallback(() => {
    return tetrominoBlocks.length > 0 && tetrominoBlocks.map((block) => renderBlock(block));
  }, [tetrominoBlocks, renderBlock]);

  const renderNextTetromino = useCallback(() => {
    if (!nextTetromino) { return null; }
    const blockOffsets = nextTetromino.type.shapeOffsets[nextTetromino.rotationIndex];
    let normalizedBlockOffsets = [...blockOffsets];
    const minColumnOffset = Math.min(...normalizedBlockOffsets.map(offset => offset[0]));
    if (minColumnOffset < 0) {
      normalizedBlockOffsets = normalizedBlockOffsets.map(offset => [offset[0] - minColumnOffset, offset[1]]);
    }
    const minRowOffset = Math.min(...normalizedBlockOffsets.map(offset => offset[1]));
    if (minRowOffset < 0) {
      normalizedBlockOffsets = normalizedBlockOffsets.map(offset => [offset[0], offset[1] - minRowOffset]);
    }
    return (
      <div className='tetris-next-tetromino-grid'>
        {normalizedBlockOffsets.map(([column, row], index) => renderBlock({
          id: -index - 1,
          position: { column, row },
          type: nextTetromino.type.blockType,
          removed: false
        }))}
      </div>
    );
  }, [nextTetromino, renderBlock]);

  const incrementScore = useCallback((scoreIncrement: number) => {
    setScore(score => score + scoreIncrement + (scoreIncrement * (level/10)));
  }, [level]);

  const executeGameTick = useCallback(() => {
    if (!isGameOver) {
      if (tetromino === null) {
        if (!spawnTetromino()) {
          setIsGameOver(true);
        }
      } else {
        if (moveTetrominoDown()) {
          if (acceleratorPressed) {
            incrementScore(SCORE_ACCELERATED_MOVE);
          }
        } else {
          freezeTetromino();
          setLevelPointsCounter(points => points + 1);
          if (acceleratorPressed) {
            playSound(Sound.HIT);
          }
        }
      }
    }
  }, [isGameOver, tetromino, acceleratorPressed, incrementScore, isValidTetromino, moveTetrominoDown, freezeTetromino]);

  useEffect(() => {
    if (isGameOver) {
      onGameover({
        level: level + 1,
        lines,
        score
      });
    }
  }, [isGameOver]);

  useEffect(() => {
    executeGameTickRef.current = executeGameTick;
  }, [executeGameTick]);

  useEffect(() => {
    let task: any = null;
    if (!isGameOver) {
      let interval = 0;
      if (acceleratorPressed || level >= INTERVAL_PER_LEVEL.length) {
        interval = ACCELERATED_INTERVAL;
      } else {
        interval = INTERVAL_PER_LEVEL[level];
      }
      task = setInterval(() => {
        executeGameTickRef.current();
      }, interval);
    }
    return () => {
      if (task != null) {
        clearInterval(task);
      }
    };
  }, [isGameOver, level, acceleratorPressed]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  useEffect(() => {
    setLevel(Math.max(0, Math.ceil(levelPointsCounter / LEVEL_POINTS_PER_LEVEL) - 1));
  }, [levelPointsCounter]);

  useEffect(() => {
    if (level > 0) {
      playSound(Sound.LEVEL_UP);
    }
  }, [level]);

  useEffect(() => {
    if (lines > 0) {
      playSound(Sound.CLEAR_LINE);
    }
  }, [lines]);

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
    const slotsMarked = [...slots];
    let linesMarked = 0;
    for (let row = 19; row >= 0; row--) {
      if (slotsMarked[row].every(cell => cell !== null && !cell.removed)) {
        slotsMarked[row].forEach(block => block && (block.removed = true));
        linesMarked++;
      }
    }
    if (linesMarked > 0) {
      setSlots(slotsMarked);
      setTimeout(() => {
        setLines(lines => lines + linesMarked);
        setLevelPointsCounter(points => points + linesMarked);
        switch (linesMarked) {
          case 1: incrementScore(SCORE_ONE_LINE_CLEARED); break;
          case 2: incrementScore(SCORE_TWO_LINES_CLEARED); break;
          case 3: incrementScore(SCORE_THREE_LINES_CLEARED); break;
          case 4: incrementScore(SCORE_FOUR_LINES_CLEARED); break;
        }
        setSlots((previousSlots) => {
          const newSlots = [...previousSlots];
          let row = 19;
          while (row >= 0) {
            if (newSlots[row].every(cell => cell !== null)) {
              newSlots.splice(row, 1);
              newSlots.unshift(Array(10).fill(null));
            } else {
              row--;
            }
          }
          newSlots.forEach((row,rowIndex) => row.forEach((block, columnIndex) => block && (block.position = { row: rowIndex, column: columnIndex })));
          return newSlots;
        });
      }, 500);
    }
  }, [slots, incrementScore]);

  return <div className={classNames({
    'tetris-panel': true,
    [className]: !!className
  })}>
    <div className={classNames({'tetris-grid': true
    })}>
      {renderTetrominoBlocks()}
      {renderBlocks()}
    </div>

    <div className={classNames({'tetris-data-panel': true,
    })}>
      <div className={classNames({'tetris-next-tetromino-panel': true})}>
        {renderNextTetromino()}
      </div>
      <div className='tetris-field'>
        <div className='label'>LEVEL</div>
        <div className='value'>{level + 1}</div>
      </div>
      <div className='tetris-field'>
        <div className='label'>LINES</div>
        <div className='value'>{lines}</div>
      </div>
      <div className='tetris-field'>
        <div className='label'>SCORE</div>
        <div className='value'>{Math.floor(score)}</div>
      </div>
    </div>
  </div>;
}