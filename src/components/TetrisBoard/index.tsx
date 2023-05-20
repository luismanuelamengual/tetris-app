import classNames from 'classnames';
import './index.scss';

interface Props {
  className?: string;
};

export function TetrisBoard({ className = '' }: Props) {


  return <div className={classNames({
    'tetris-board': true,
    [className]: !!className
  })}>
    <div className='piece'>
      <div className='brick x4 y5' />
      <div className='brick x5 y5' />
      <div className='brick x5 y4' />
      <div className='brick x6 y4' />
    </div>
  </div>;
}