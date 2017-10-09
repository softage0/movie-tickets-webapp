import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import swal from 'sweetalert2';

import utils from '../../utils';


export class Header extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        const propActions = this.props.actions.app;

        utils.fetch(
            'get',
            '/api/logout',
        ).then((response) => {
            if (!response.status) {
                propActions.setAccountInfo();
                this.props.history.push('/');
                swal({
                    title: 'Logout succeeded',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                }).catch(swal.noop);
            } else {
                swal({
                    title: 'Logout failed',
                    type: 'warning',
                });
            }
        });
    }

    render() {
        const {history} = this.props;
        const propStates = this.props.states.app;

        return (
            <Navbar fixedTop inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>Movie Tickets</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    {propStates.accountInfo ?
                        <Nav pullRight>
                            {
                                propStates.accountInfo['type'] === 'admin' &&
                                <NavItem eventKey={1} onClick={() => history.push('/admin')}>Admin Page</NavItem>
                            }
                            <NavItem eventKey={2} onClick={this.logout}>
                                {propStates.accountInfo.name} logout
                            </NavItem>
                        </Nav>
                        :
                        <Nav pullRight>
                            <NavItem eventKey={3} onClick={() => history.push('/login')}>Login</NavItem>
                            <NavItem eventKey={4} onClick={() => history.push('/signUp')}>Sign Up</NavItem>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default withRouter(Header);
