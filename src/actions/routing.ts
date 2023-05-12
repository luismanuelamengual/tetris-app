import { Path } from 'models';
import { Router } from 'router';

export function goToHomePage() {
  Router.navigate(Path.HOME);
}
