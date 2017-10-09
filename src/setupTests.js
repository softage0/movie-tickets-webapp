// configuration script for test
//
// reference: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#initializing-test-environment

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};
