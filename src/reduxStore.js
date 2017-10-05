import {combineReducers, createStore} from 'redux';

import app from './containers/App/_reducer';


const rootReducer = combineReducers({
    app,
});

export default createStore(rootReducer);
