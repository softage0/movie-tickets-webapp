import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import swal from 'sweetalert2';

import utils from '../../utils';
import FieldGroup from '../../components/FieldGroup';


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            password: null,
            name: null,
            ajaxFetching: false,
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
        const {id, password, name} = this.state;
        let params = {
            id,
            password,
            name,
        };

        if (!params['id'] || !params['password'] || (type === 'signUp' && !params['name'])) {
            swal({
                title: 'Please fill in all fields.',
                type: 'warning',
                showConfirmButton: false,
                timer: 1000,
            }).catch(swal.noop);
            return;
        }

        if (type === 'signUp') {
            params = Object.assign({}, params, {
                type: 'customer',
            });
        }

        this.setState({
            ajaxFetching: true,
        }, () => {
            utils.fetch(
                'post',
                type === 'login' ? '/api/login' : '/api/signUp',
                params,
            ).then(function (response) {
                if(!response || !response.status) {
                    propActions.setAccountInfo(response);
                    if (type === 'login') {
                        if (response['type'] === 'admin') {
                            history.push('/admin');
                        } else {
                            history.push('/');
                        }
                    } else {
                        history.push('/login');
                    }
                    swal({
                        title: response && response['name'] ?
                            response['name'] + ' successfully logged in.' : 'Sign up succeeded.',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000,
                    }).catch(swal.noop);
                } else {
                    switch (response.status) {
                        case 404:
                            swal({
                                title: 'ID doesn\'t exist.',
                                type: 'warning',
                            });
                            break;
                        case 409:
                            swal({
                                title: 'ID already exists.',
                                type: 'warning',
                            });
                            break;
                        case 412:
                            swal({
                                title: 'Incorrect Password',
                                type: 'warning',
                            });
                            break;
                        default:
                            swal({
                                title: 'Unknown Error',
                                type: 'warning',
                            });
                    }
                    this.setState({
                        ajaxFetching: false,
                    });
                }
            });
        });

    }

    render() {
        const {type} = this.props;
        const {ajaxFetching} = this.state;

        return (
            <div className="pos-r">
                {
                    ajaxFetching &&
                    <div className="loading-wrapper">
                        <div className="loading-indicator"/>
                    </div>
                }
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
