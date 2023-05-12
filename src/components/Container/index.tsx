import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';

interface Props {
  mode?: 'normal' | 'fluid';
  children: ReactNode;
  className?: string;
};

export function Container({ children, mode = 'normal', className = '' }: Props) {
  return <div className={classNames({
    'container': true,
    'container-fluid': mode === 'fluid',
    [className]: !!className
  })}>{children}</div>;
}