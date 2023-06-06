import { goToHomePage, startNewGame } from 'actions';
import { Button, Modal, NameInput, Page, TetrisPanel } from 'components';
import './index.scss';

export function GameRoomPage() {
  const onGameOver = () => {

  };

  return (
    <Page id='game-room-page'>
      <TetrisPanel onGameover={onGameOver}/>
      <Modal>
        <div className='title'>Game Over</div>
        <div className='subtitle'>Enter your initials</div>
        <NameInput />
        <Button onClick={startNewGame}>RETRY</Button>
        <Button onClick={goToHomePage}>EXIT</Button>
      </Modal>
    </Page>
  );
}