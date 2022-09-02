import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import './assets/css/index.css';

import Layout from './components/Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);

serviceWorker.unregister();
