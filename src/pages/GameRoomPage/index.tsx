import { goToHomePage, publishGameResult } from 'actions';
import { Button, Modal, NameInput, Page, TetrisPanel } from 'components';
import { MatchResult } from 'models';
import { useState } from 'react';
import { useSettingsStore } from 'stores';
import './index.scss';

export function GameRoomPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [name, setName] = useState<string>('');
  const keyboardControls = useSettingsStore(state => state.keyboardControls1);

  const onGameOver = (result: MatchResult) => {
    setResult(result);
    setName('');
    setModalOpen(true);
  };

  const onExitButtonClicked = () => {
    if (result != null) {
      publishGameResult({
        playerName: name,
        result: result
      });
    }
    goToHomePage();
  };

  return (
    <Page id='game-room-page'>
      <TetrisPanel keyboardControls={keyboardControls} onGameover={onGameOver}/>
      <Modal open={modalOpen}>
        <div className='title'>Game Over</div>
        <div className='score'>{result?.score}</div>
        <div className='subtitle'>Enter your initials</div>
        <NameInput value={name} onChange={setName} />
        <Button disabled={name.length == 0} onClick={onExitButtonClicked}>EXIT</Button>
      </Modal>
    </Page>
  );
}