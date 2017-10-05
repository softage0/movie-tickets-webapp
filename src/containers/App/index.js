import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// components
import Header from '../../components/Header';

// Views
import BoxOffice from '../../views/BoxOffice';
import MyPage from '../../views/MyPage';

// Actions
import appActions from './_action';


class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header states={this.props.states} actions={this.props.actions}/>
                    <div className="main-content">
                        <Route exact path='/'
                               render={() => <BoxOffice states={this.props.states} actions={this.props.actions}/>}/>
                        <Route path='/MyPage'
                               render={() => <MyPage states={this.props.states} actions={this.props.actions}/>}/>
                        <Route path='/signup'
                               render={() => <BoxOffice states={this.props.states} actions={this.props.actions}/>}/>
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
