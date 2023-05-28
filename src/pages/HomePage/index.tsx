import { Button, ButtonType, Page } from 'components';
import './index.scss';

export function HomePage() {
  return (
    <Page id='home-page'>
      <Button type={ButtonType.PRIMARY}>1P MODE</Button>
      <Button>2P VERSUS</Button>
      <Button>RANKINGS</Button>
      <Button>SETTINGS</Button>
    </Page>
  );
}