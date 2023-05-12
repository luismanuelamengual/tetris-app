import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';
import { Container } from 'components';

interface Props {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function Page({ id = '', children, className = '' }: Props) {
  return <div id={id} className={classNames({
    'page': true,
    [className]: !!className
  })}>
    <Container className='page-container'>
      {children}
    </Container>
  </div>;
}