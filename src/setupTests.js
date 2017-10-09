// configuration script for test
//
// reference: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#initializing-test-environment

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

// https://reactjs.org/docs/javascript-environment-requirements.html
global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};

// `Object.entries` polyfill since `Jest` doesn't support it
Object.entries = (obj) => {
    const entries = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
        entries.push([key, obj[key]]);
    }
    return entries;
};
