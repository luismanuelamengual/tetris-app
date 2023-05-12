import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';

interface Props {
  children: ReactNode;
  className?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
};

export function Column({ children, xs = 0, sm = 0, md = 0, lg = 0, className = '' }: Props) {
  return <div className={classNames({
    'column': true,
    [`column-xs-${xs}`]: xs > 0,
    [`column-sm-${sm}`]: sm > 0,
    [`column-md-${md}`]: md > 0,
    [`column-lg-${lg}`]: lg > 0,
    [className]: !!className
  })}>{children}</div>;
}