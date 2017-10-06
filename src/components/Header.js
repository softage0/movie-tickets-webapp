import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap';


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

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
                    {propStates.accountInfo ?
                        <Nav pullRight>
                            <NavItem eventKey={1} onClick={() => history.push('/myPage')}>My Page</NavItem>
                            <NavItem eventKey={2} onClick={propActions.logout}>
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
