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
    <div className='block block-x-10 block-y-1' />
  </div>;
}