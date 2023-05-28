import { Path } from 'models';
import { GameRoomPage, HomePage, SettingsPage } from 'pages';
import { RankingsPage } from 'pages/RankingsPage';
import { createBrowserRouter } from 'react-router-dom';

export const Router = createBrowserRouter([
  {
    path: Path.HOME,
    element: <HomePage />,
  },
  {
    path: Path.GAME_ROOM,
    element: <GameRoomPage />
  },
  {
    path: Path.RANKINGS,
    element: <RankingsPage />
  },
  {
    path: Path.SETTINGS,
    element: <SettingsPage />
  }
], {
  basename: process.env.PUBLIC_URL
});