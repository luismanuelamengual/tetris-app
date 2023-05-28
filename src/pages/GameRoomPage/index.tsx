import { Page, TetrisPanel } from 'components';
import './index.scss';

export function GameRoomPage() {
  return (
    <Page id='game-room-page'>
      <TetrisPanel />
    </Page>
  );
}