import classNames from 'classnames';
import './index.scss';

interface Props {
  className?: string;
};

export function Board({ className = '' }: Props) {


  return <div className={classNames({
    'board': true,
    [className]: !!className
  })}>
    <div className='piece'>
      <div className='brick x4 y5' />
      <div className='brick x5 y5' />
      <div className='brick x5 y4' />
      <div className='brick x6 y4' />



      <div className='brick x1 y1' />
    </div>
  </div>;
}