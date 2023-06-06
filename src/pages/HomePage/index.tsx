import { goToRankingsPage, goToSettingsPage, startNewGame } from 'actions';
import { Button, ButtonType, Page } from 'components';
import './index.scss';

export function HomePage() {
  return (
    <Page id='home-page'>
      <Button type={ButtonType.PRIMARY} onClick={startNewGame}>1P MODE</Button>
      <Button>2P VERSUS</Button>
      <Button onClick={goToRankingsPage}>RANKINGS</Button>
      <Button onClick={goToSettingsPage}>SETTINGS</Button>
    </Page>
  );
}