import { goToRankingsPage, goToSettingsPage } from 'actions';
import { Button, ButtonType, Modal, NameInput, Page } from 'components';
import './index.scss';

export function HomePage() {
  return (
    <Page id='home-page'>
      <Button type={ButtonType.PRIMARY}>1P MODE</Button>
      <Button>2P VERSUS</Button>
      <Button onClick={goToRankingsPage}>RANKINGS</Button>
      <Button onClick={goToSettingsPage}>SETTINGS</Button>


      <Modal closable={false}><NameInput /></Modal>
    </Page>
  );
}