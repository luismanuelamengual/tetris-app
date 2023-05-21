import { Version } from 'components';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.scss';
import { Router } from './router';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Version />
    <RouterProvider router={Router} />
  </>
);

serviceWorkerRegistration.register();
