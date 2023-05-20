import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

const Tetris = () => {
  const gridRows = 20;
  const gridColumns = 10;
  const emptyCellValue = 0;

  const [grid, setGrid] = useState([]);
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    const newGrid = Array.from({ length: gridRows }, () =>
      Array(gridColumns).fill(emptyCellValue)
    );
    setGrid(newGrid);
    spawnTetromino();
    setIsGameOver(false);
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const tetrominos = [
    // Tetromino shapes
    [
      [1, 1, 1, 1], // I
      [1],
      [1, 1, 1, 1], // I
      [1],
    ],
    [
      [1, 1, 1], // J
      [0, 0, 1],
      [1, 1, 1], // J
      [1, 0, 0],
    ],
    [
      [1, 1, 1], // L
      [1, 0, 0],
      [1, 1, 1], // L
      [0, 0, 1],
    ],
    [
      [1, 1], // O
      [1, 1],
    ],
    [
      [1, 1, 1], // T
      [0, 1, 0],
      [1, 1, 1], // T
      [0, 1, 0],
    ],
    [
      [1, 1, 0], // S
      [0, 1, 1],
      [1, 1, 0], // S
      [0, 1, 1],
    ],
    [
      [0, 1, 1], // Z
      [1, 1, 0],
      [0, 1, 1], // Z
      [1, 1, 0],
    ],
  ];

  const colors = [
    '#000000', // empty cell
    '#00FFFF', // cyan (I)
    '#0000FF', // blue (J)
    '#FFA500', // orange (L)
    '#FFFF00', // yellow (O)
    '#800080', // purple (T)
    '#00FF00', // green (S)
    '#FF0000', // red (Z)
  ];

  const spawnTetromino = () => {
    const randomTetrominoIndex = Math.floor(Math.random() * tetrominos.length);
    const randomRotationIndex = Math.floor(
      Math.random() * tetrominos[randomTetrominoIndex].length
    );
    const tetromino = tetrominos[randomTetrominoIndex][randomRotationIndex];
    const initialX = Math.floor((gridColumns - tetromino[0].length) / 2);
    setCurrentTetromino(tetromino);
    setCurrentRotation(randomRotationIndex);
    setCurrentPosition({ x: initialX, y: 0 });

    if (isCollision(tetromino, currentPosition)) {
      setIsGameOver(true);
      cancelAnimationFrame(requestRef.current);
    }
  };

  const isCollision = (tetromino, position) => {
    for (let row = 0; row < tetromino.length; row++) {
      for (let col = 0; col < tetromino[row].length; col++) {
        if (
          tetromino[row][col] &&
          (grid[row + position.y] &&
            grid[row + position.y][col + position.x]) !== emptyCellValue
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const rotate = () => {
    const rotatedTetromino =
      tetrominos[currentTetromino][
        (currentRotation + 1) % tetrominos[currentTetromino].length
      ];
    if (!isCollision(rotatedTetromino, currentPosition)) {
      setCurrentRotation((currentRotation + 1) % tetrominos[currentTetromino].length);
    }
  };

  const moveLeft = () => {
    if (
      !isCollision(currentTetromino, { x: currentPosition.x - 1, y: currentPosition.y })
    ) {
      setCurrentPosition({ x: currentPosition.x - 1, y: currentPosition.y });
    }
  };

  const moveRight = () => {
    if (
      !isCollision(currentTetromino, { x: currentPosition.x + 1, y: currentPosition.y })
    ) {
      setCurrentPosition({ x: currentPosition.x + 1, y: currentPosition.y });
    }
  };

  const moveDown = () => {
    if (
      !isCollision(currentTetromino, { x: currentPosition.x, y: currentPosition.y + 1 })
    ) {
      setCurrentPosition({ x: currentPosition.x, y: currentPosition.y + 1 });
    } else {
      freeze();
    }
  };

  const freeze = () => {
    for (let row = 0; row < currentTetromino.length; row++) {
      for (let col = 0; col < currentTetromino[row].length; col++) {
        if (currentTetromino[row][col]) {
          if (
            grid[row + currentPosition.y] &&
            grid[row + currentPosition.y][col + currentPosition.x] !== emptyCellValue
          ) {
            setIsGameOver(true);
            cancelAnimationFrame(requestRef.current);
            return;
          }
          grid[row + currentPosition.y][col + currentPosition.x] =
            tetrominos.indexOf(currentTetromino) + 1;
        }
      }
    }

    setGrid([...grid]);

    clearLines();
    spawnTetromino();
  };

  const clearLines = () => {
    const newGrid = [...grid];
    let linesCleared = 0;
    for (let row = gridRows - 1; row >= 0; row--) {
      if (newGrid[row].every(cell => cell !== emptyCellValue)) {
        newGrid.splice(row, 1);
        newGrid.unshift(Array(gridColumns).fill(emptyCellValue));
        linesCleared++;
      }
    }
    setGrid(newGrid);
  };

  const update = () => {
    moveDown();
    requestRef.current = requestAnimationFrame(update);
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div className="row" key={rowIndex}>
        {row.map((cell, colIndex) => (
          <div
            className="cell"
            key={colIndex}
            style={{ background: colors[cell] }}
          ></div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="game">
        <div className="grid">{renderGrid()}</div>
      </div>
      {isGameOver && <div className="game-over">Game Over</div>}
      <div className="controls">
        <button onClick={rotate}>Rotate</button>
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
      </div>
    </div>
  );
};

export default Tetris;
