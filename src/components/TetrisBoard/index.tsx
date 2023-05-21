import classNames from 'classnames';
import { Block } from 'models';
import { useEffect, useState } from 'react';
import './index.scss';

const GRID_ROWS = 20;
const GRID_COLUMNS = 10;

interface Props {
  className?: string;
};

export function TetrisBoard({ className = '' }: Props) {
  const [slots, setSlots] = useState<Array<Array<Block | null>>>();

  useEffect(() => {
    setSlots(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLUMNS).fill(null)));
  }, []);

  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    {slots?.map((row, rowIndex) => (
      <>
        {row.map((block, colIndex) => block != null ? (
          <div className={classNames({
            'block': true,
            [`block-${block.type}`]: true,
            [`x${colIndex + 1}`]: true,
            [`y${rowIndex + 1}`]: true,
          })} key={block?.id} />
        ) : null)}
      </>
    ))}
  </div>;
}