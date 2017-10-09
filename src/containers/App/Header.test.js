import React from 'react';
import {Link} from 'react-router-dom';
import {NavItem} from 'react-bootstrap';
import {shallow} from 'enzyme';

import {Header} from './Header';


describe('Header Test', () => {
    test('renders without crashing', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        shallow(<Header states={states}/>);
    });

    test('Header contains title `Movie Tickets`', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        const wrapper = shallow(<Header states={states}/>);

        expect(wrapper.contains(<Link to='/'>Movie Tickets</Link>)).toEqual(true);
    });

    test('Menus without login test', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        const wrapper = shallow(<Header states={states}/>);

        const menus = wrapper.find(NavItem);
        expect(menus).toHaveLength(2);
        expect(menus.at(0).render().text()).toEqual('Login');
        expect(menus.at(1).render().text()).toEqual('Sign Up');
    });

    test('Menus with `admin` login', () => {
        const states = {
            app: {
                accountInfo: {
                    id: 'admin',
                    type: 'admin',
                    name: '관리자',
                },
            },
        };
        const wrapper = shallow(<Header states={states}/>);

        const menus = wrapper.find(NavItem);
        expect(menus).toHaveLength(2);
        expect(menus.at(0).render().text()).toEqual('Admin Page');
        expect(menus.at(1).render().text()).toEqual('관리자 logout');
    });

    test('Menus with `customer` login', () => {
        const states = {
            app: {
                accountInfo: {
                    id: 'wonju',
                    type: 'customer',
                    name: 'Wonju Jeon'
                },
            },
        };
        const wrapper = shallow(<Header states={states}/>);

        const menus = wrapper.find(NavItem);
        expect(menus).toHaveLength(1);
        expect(menus.at(0).render().text()).toEqual('Wonju Jeon logout');
    });
});
