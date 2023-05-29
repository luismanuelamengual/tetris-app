import { goToHomePage } from 'actions';
import { Button, ButtonType, Page } from 'components';
import './index.scss';

export function SettingsPage() {
  return (
    <Page id='settings-page'>
      <div className='settings-form'>

      </div>
      <Button type={ButtonType.PRIMARY}>GUARDAR</Button>
      <Button onClick={goToHomePage}>SALIR</Button>
    </Page>
  );
}