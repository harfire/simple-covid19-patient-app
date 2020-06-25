import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './assets/css/index.css';

import Layout from './components/Layout';

ReactDOM.render(<Layout />, document.getElementById('root'));

serviceWorker.unregister();
