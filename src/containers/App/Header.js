import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap';

import utils from '../../utils';


class Header extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        const propActions = this.props.actions.app;

        utils.fetch(
            'get',
            'api/logout',
        ).then(function (response) {
            console.log(response);
            propActions.setAccountInfo();
        });
    }

    render() {
        const {history} = this.props;
        const propStates = this.props.states.app;

        console.log(propStates);
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>Movie Tickets</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {propStates.accountInfo ?
                        <Nav pullRight>
                            <NavItem eventKey={1} onClick={() => history.push('/myPage')}>My Page</NavItem>
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
