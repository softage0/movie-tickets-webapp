import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap';


class Header extends Component {
    render() {
        const {history} = this.props;
        const propActions = this.props.actions.app;
        const propStates = this.props.states.app;

        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>Movie Tickets</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} onClick={() => history.push('/MyPage')}>My Page</NavItem>
                        {!propStates.accountInfo &&
                        <NavItem eventKey={2} onClick={() => history.push('/signup')}>Sign Up</NavItem>}
                        {!propStates.accountInfo &&
                        <NavItem eventKey={3} onClick={() => history.push('/login')}>Login</NavItem>}
                        {propStates.accountInfo &&
                        <NavItem eventKey={4} onClick={propActions.logout}>
                            {propStates.accountInfo.name} logout
                        </NavItem>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default withRouter(Header);
