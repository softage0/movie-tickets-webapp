import React from 'react';
import {shallow} from 'enzyme';

import FieldGroup from '../../components/FieldGroup';
import {Login} from './_Login';

const props = {
    history: {
        push: jest.fn(),
    },
    states: {
        app: {
            accountInfo: null,
        },
    },
};


describe('Login Test', () => {
    test('renders without crashing', () => {
        shallow(<Login {...props}/>);
    });

    test('Login page contains `Login`', () => {
        const wrapper = shallow(<Login type={'login'} {...props}/>);

        expect(wrapper.contains(<h1>Login</h1>)).toEqual(true);
    });

    test('Login page component check', () => {
        const wrapper = shallow(<Login type={'login'} {...props}/>);

        expect(wrapper.find(FieldGroup)).toHaveLength(2);
        expect(wrapper.find(FieldGroup).at(0).props().id).toEqual('id');
        expect(wrapper.find(FieldGroup).at(1).props().id).toEqual('password');
    });

    test('SignUp page contains `Sign Up`', () => {
        const wrapper = shallow(<Login type={'signUp'} {...props}/>);

        expect(wrapper.contains(<h1>Sign Up</h1>)).toEqual(true);
    });

    test('SignUp page component check', () => {
        const wrapper = shallow(<Login type={'signUp'} {...props}/>);

        expect(wrapper.find(FieldGroup)).toHaveLength(3);
        expect(wrapper.find(FieldGroup).at(0).props().id).toEqual('id');
        expect(wrapper.find(FieldGroup).at(1).props().id).toEqual('password');
        expect(wrapper.find(FieldGroup).at(2).props().id).toEqual('name');
    });
});
