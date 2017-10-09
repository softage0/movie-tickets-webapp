import React from 'react';
import {Button} from 'react-bootstrap';
import {shallow} from 'enzyme';

import MovieEditor from '../../components/MovieEditor';
import {Admin} from './_Admin';

const propsHistory = {
    push: jest.fn(),
};

const states = {
    app: {
        accountInfo: {
            id: 'admin',
            type: 'admin',
        },
    },
};

const mockMovies = [{
    "_id": "59d8b30bbfb1513a12ae195b",
    "movieCd": "20171817",
    "movieNm": "넛잡 2",
    "theater": "CGV",
    "showTime": "3PM"
}, {
    "_id": "59d8c7ab2f2e4a414cbe848b",
    "movieCd": "20174142",
    "movieNm": "아이 캔 스피크",
    "theater": "Megabox",
    "showTime": "12PM",
    "bookedSeats": ["A6", "A7"]
}, {
    "_id": "59d8ad68c112793823f8a0a7",
    "movieCd": "20175222",
    "movieNm": "킹스맨: 골든 서클",
    "theater": "CGV",
    "showTime": "12PM",
    "bookedSeats": ["F6", "F7", "D6", "D7", "E6", "E7"]
}, {
    "_id": "59d8b3a8f2c3b53a4db358ff",
    "movieCd": "20175222",
    "movieNm": "킹스맨: 골든 서클",
    "theater": "CGV",
    "showTime": "9PM"
}];


describe('Admin Test', () => {
    test('renders without crashing', () => {
        shallow(<Admin states={states} history={propsHistory}/>);
    });

    test('Admin contains `Movie Management` table', () => {
        const wrapper = shallow(<Admin states={states} history={propsHistory}/>);

        expect(wrapper.contains(<h1>Admin Page - Movie Management</h1>)).toEqual(true);
    });

    test('`MovieEditor` show/hide test', () => {
        const wrapper = shallow(<Admin states={states} history={propsHistory}/>);
        wrapper.setState({
            movies: mockMovies,
        });

        let rows = wrapper.find('tbody > tr');
        expect(rows).toHaveLength(4);

        rows.at(2).find(Button).at(0).simulate('click');    // click `Edit` button

        rows = wrapper.find('tbody > tr');
        expect(rows).toHaveLength(5);
        expect(rows.at(3).find(MovieEditor)).toHaveLength(1);

        wrapper.find(Button).last().simulate('click');      // click `Cancel` button
        rows = wrapper.find('tbody > tr');
        expect(rows).toHaveLength(4);
    });
});
