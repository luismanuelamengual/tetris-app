import classNames from 'classnames';
import './index.scss';

export enum ButtonType {
  NORMAL = 'normal',
  PRIMARY = 'primary'
}

interface Props {
  type?: ButtonType;
  disabled?: boolean;
  children: string;
  className?: string;
  onClick?: () => void
}

export function Button({ type = ButtonType.NORMAL, disabled = false, children, className = '', onClick = undefined}: Props) {
  return <button disabled={disabled} className={classNames({
    'button': true,
    'button-disabled': disabled,
    [`button-${type}`]: true,
    [className]: !!className
  })} onClick={onClick}>
    {children}
  </button>;
}