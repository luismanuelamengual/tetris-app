import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import './index.scss';

interface Props {
  children: ReactNode;
  open?: boolean;
  className?: string;
  onClose?: () => void;
};

export function Modal({ children, open = true, onClose = undefined, className = '' }: Props) {
  const [openState, setOpenState] = useState<boolean>(open);
  useEffect(() => { setOpenState(open); }, [open]);

  function onOverlayClick() {
    setOpenState(false);
    onClose && onClose();
  }

  return <div className={classNames({
    'modal': true,
    'modal-open': openState,
    [className]: !!className
  })}>
    <div className='modal-overlay' onClick={onOverlayClick}></div>
    <div className='modal-panel'>{children}</div>
  </div>;
}