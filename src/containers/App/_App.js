import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import utils from '../../utils';

// components
import Header from './Header';

// Views
import BoxOffice from '../../views/BoxOffice';
import Booking from '../../views/Booking';
import Admin from '../../views/Admin';
import Login from '../../views/Login';

// Actions
import appActions from './_action';


class App extends Component {
    componentDidMount() {
        const propActions = this.props.actions.app;

        // session check - auto login if session is valid when reloaded
        utils.fetch(
            'get',
            '/api/session',
        ).then(function (response) {
            if (response.account) {
                propActions.setAccountInfo(response.account);
            }
        });
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Header states={this.props.states} actions={this.props.actions}/>
                    <div className="main-content">
                        <Route exact path='/'
                               render={() => <BoxOffice states={this.props.states} actions={this.props.actions}/>}/>
                        <Route path='/booking/:_id'
                               render={() => <Booking states={this.props.states} actions={this.props.actions}/>}/>
                        <Route path='/admin'
                               render={() => <Admin states={this.props.states} actions={this.props.actions}/>}/>
                        <Route path='/login'
                               render={() => <Login states={this.props.states}
                                                    actions={this.props.actions} type='login'/>}/>
                        <Route path='/signUp'
                               render={() => <Login states={this.props.states}
                                                    actions={this.props.actions} type='signUp'/>}/>
                    </div>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (states) => {
    return {
        states,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            app: bindActionCreators(appActions, dispatch),
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
