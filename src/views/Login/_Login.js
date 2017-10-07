import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

import utils from '../../utils';
import FieldGroup from '../../components/FieldGroup';


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            password: null,
            name: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const propStates = this.props.states.app;

        // if it's already logged in, it will redirect to main page
        propStates.accountInfo && this.props.history.push('/');
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    submit() {
        const {type, history} = this.props;
        const propActions = this.props.actions.app;
        let params = this.state;


        if (type === 'signUp') {
            params = Object.assign({}, params, {
                type: 'customer',
            });
        }

        utils.fetch(
            'post',
            type === 'login' ? 'api/login' : 'api/signUp',
            params,
        ).then(function (response) {
            propActions.setAccountInfo(response);
            type === 'login' ? history.push('/') : history.push('/login');
        });
    }

    render() {
        const {type} = this.props;

        return (
            <div>
                <h1>{type === 'login' ? 'Login' : 'Sign Up'}</h1>
                <div>
                    <Form componentClass="fieldset" horizontal>
                        <FieldGroup
                            id="id"
                            type="text"
                            label="ID"
                            onChange={this.handleChange}
                        />
                        <FieldGroup
                            id="password"
                            label="Password"
                            type="password"
                            onChange={this.handleChange}
                        />
                        {type === 'signUp' &&
                        <FieldGroup
                            id="name"
                            type="text"
                            label="Name"
                            placeholder="Enter your name"
                            onChange={this.handleChange}
                        />}
                    </Form>
                    <Button type="submit" onClick={this.submit}>
                        Submit
                    </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);
