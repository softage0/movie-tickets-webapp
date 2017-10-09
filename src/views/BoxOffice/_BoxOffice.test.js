import React from 'react';
import {shallow} from 'enzyme';

import {BoxOffice} from './_BoxOffice';

const mockMovieHistory = [{
    "_id": "59d9caa6320d226ef8c961f2",
    "movieScheduleId": "59d8ad68c112793823f8a0a7",
    "accountId": "wonju",
    "overallBookedSeats": ["C6", "C7"],
    "bookedSeats": ["C6", "C7"],
    "canceledSeats": [],
    "timestamp": "2017-10-08T06:50:14.403Z",
    "movieCd": "20175222",
    "movieNm": "킹스맨: 골든 서클",
    "theater": "CGV",
    "showTime": "12PM"
}];


describe('BoxOffice Test', () => {
    test('renders without crashing', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        shallow(<BoxOffice states={states}/>);
    });

    test('BoxOffice contains `Box Office Status`', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        const wrapper = shallow(<BoxOffice states={states} />);

        expect(wrapper.contains(<h1>Box Office Status</h1>)).toEqual(true);
    });

    test('BoxOffice doesn\'t contain `Booking History` unless it has bookingHistory', () => {
        const states = {
            app: {
                accountInfo: null,
            },
        };
        const wrapper = shallow(<BoxOffice states={states} />);
        wrapper.setState({
            bookingHistory: mockMovieHistory,
        });

        expect(wrapper.find('h1')).toHaveLength(1);
    });

    test('BoxOffice contains `Total Booking History` if it\'s logged in as `admin`', () => {
        const states = {
            app: {
                accountInfo: {
                    id: 'admin',
                    type: 'admin',
                },
            },
        };

        const wrapper = shallow(<BoxOffice states={states} />);
        wrapper.setState({
            bookingHistory: mockMovieHistory,
        });

        expect(wrapper.contains(<h1>Total Booking History (Admin)</h1>)).toEqual(true);
    });

    test('BoxOffice contains `My Booking History` if it\'s logged in as `customer`', () => {
        const states = {
            app: {
                accountInfo: {
                    id: 'wonju',
                    type: 'customer',
                },
            },
        };

        const wrapper = shallow(<BoxOffice states={states} />);
        wrapper.setState({
            bookingHistory: mockMovieHistory,
        });

        expect(wrapper.contains(<h1>My Booking History</h1>)).toEqual(true);
    });
});
