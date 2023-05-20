import classNames from 'classnames';
import { Brick } from 'models';
import { useEffect, useState } from 'react';
import './index.scss';

const GRID_ROWS = 20;
const GRID_COLUMNS = 10;

interface Props {
  className?: string;
};

export function TetrisBoard({ className = '' }: Props) {
  const [slots, setSlots] = useState<Array<Array<Brick | null>>>();

  useEffect(() => {
    setSlots(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLUMNS).fill(null)));
  }, []);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {slots?.map((row, rowIndex) => (
      <>
        {row.map((brick, colIndex) => brick != null ? (
          <div className={classNames({
            'brick': true,
            [`brick-${brick.type}`]: true,
            [`x${colIndex + 1}`]: true,
            [`y${rowIndex + 1}`]: true,
          })} key={brick?.id} />
        ) : null)}
      </>
    ))}
  </div>;
}