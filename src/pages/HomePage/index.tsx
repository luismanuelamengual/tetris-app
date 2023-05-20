import { Page, TetrisBoard } from 'components';
import './index.scss';

export function HomePage() {
  return (
    <Page id='home-page'>
      <TetrisBoard />
    </Page>
  );
}