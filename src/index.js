import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import reduxStore from './reduxStore';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import App from './containers/App';

// `Object.entries` polyfill for IE support
if (!Object.entries) {
    Object.entries = function (obj) {
        const ownProps = Object.keys(obj);
        let i = ownProps.length;
        const resArray = new Array(i); // preallocate the Array

        while (i--) {
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        }

        return resArray;
    };
}

ReactDOM.render(<Provider store={reduxStore}>
    <App/>
</Provider>, document.getElementById('root'));
registerServiceWorker();
