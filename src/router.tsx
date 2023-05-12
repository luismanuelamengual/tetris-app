import { Path } from 'models';
import { HomePage } from 'pages';
import { createBrowserRouter } from 'react-router-dom';

export const Router = createBrowserRouter([
  {
    path: Path.HOME,
    element: <HomePage />,
  }
], {
  basename: process.env.PUBLIC_URL
});