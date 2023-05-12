import packageJson from '../../../package.json';
import './index.scss';

export function Version() {
  return <div className='version'>{packageJson.version}</div>;
}