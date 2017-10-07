import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';


export class MyPage extends Component {
    componentDidUpdate() {
        const propStates = this.props.states.app;

        // if it's not logged in, it will redirect to login page
        !propStates.accountInfo && this.props.history.push('/login');
    }

    render () {
        return (
            <div>
                <h1>My Page</h1>
                <p>Please select one of the above functions you want to use.</p>
            </div>
        )
    }
}

export default withRouter(MyPage);
