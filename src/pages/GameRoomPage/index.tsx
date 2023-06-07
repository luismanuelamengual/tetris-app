import { goToHomePage, startNewGame } from 'actions';
import { Button, Modal, NameInput, Page, TetrisPanel } from 'components';
import { MatchResult } from 'models';
import { useState } from 'react';
import './index.scss';

export function GameRoomPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const onGameOver = (result: MatchResult) => {
    setModalOpen(true);
  };

  return (
    <Page id='game-room-page'>
      <TetrisPanel onGameover={onGameOver}/>
      <Modal open={modalOpen}>
        <div className='title'>Game Over</div>
        <div className='subtitle'>Enter your initials</div>
        <NameInput />
        <Button onClick={startNewGame}>RETRY</Button>
        <Button onClick={goToHomePage}>EXIT</Button>
      </Modal>
    </Page>
  );
}