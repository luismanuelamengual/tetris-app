import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import './index.scss';

interface Props {
  children: ReactNode;
  open?: boolean;
  closable?: boolean;
  className?: string;
  onClose?: () => void;
};

export function Modal({ children, open = true, onClose = undefined, className = '', closable = true }: Props) {
  const [openState, setOpenState] = useState<boolean>(open);
  useEffect(() => { setOpenState(open); }, [open]);

  function onOverlayClick() {
    setOpenState(false);
    onClose && onClose();
  }

  const overlayAttributes: any = {};
  if (closable) {
    overlayAttributes.onClick = onOverlayClick;
  }
  return <div className={classNames({
    'modal': true,
    'modal-open': openState,
    [className]: !!className
  })}>
    <div className='modal-overlay' {...overlayAttributes}></div>
    <div className='modal-panel'>{children}</div>
  </div>;
}