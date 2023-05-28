import { Path } from 'models';
import { Router } from 'router';

export function goToHomePage() {
  Router.navigate(Path.HOME);
}

export function goToGameRoomPage() {
  Router.navigate(Path.GAME_ROOM);
}

export function goToSettingsPage() {
  Router.navigate(Path.SETTINGS);
}

export function goToRankingsPage() {
  Router.navigate(Path.RANKINGS);
}
