import { Version } from 'components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.scss';
import { Router } from './router';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Version />
    <RouterProvider router={Router} />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
