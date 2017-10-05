import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import reduxStore from './reduxStore';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import App from './containers/App';


ReactDOM.render(<Provider store={reduxStore}>
    <App/>
</Provider>, document.getElementById('root'));
registerServiceWorker();
