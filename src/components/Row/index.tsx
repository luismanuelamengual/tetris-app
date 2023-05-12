import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';

interface Props {
  children: ReactNode;
  className?: string;
};

export function Row({ children, className = '' }: Props) {
  return <div className={classNames({
    'row': true,
    [className]: !!className
  })}>{children}</div>;
}