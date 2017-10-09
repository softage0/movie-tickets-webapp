jest.mock('../../utils');

import React from 'react';
import {ListGroupItem, Button} from 'react-bootstrap';
import {shallow} from 'enzyme';

import {Booking} from './_Booking';

const props = {
    history: {
        push: jest.fn(),
    },
    match: {
        params: {
            _id: '59d8ad68c112793823f8a0a7',
        },
    },
    states: {
        app: {
            accountInfo: {
                id: 'wonju',
                type: 'customer',
            },
        },
    },
};

const mockMovieData = {
    "_id": "59d8ad68c112793823f8a0a7",
    "movieCd": "20175222",
    "movieNm": "킹스맨: 골든 서클",
    "theater": "CGV",
    "showTime": "12PM",
    "bookedSeats": ["F6", "F7", "D6", "D7", "E6", "E7"],
    "myBookedSeats": ["F6", "F7"]
};

describe('Booking Test', () => {
    test('renders without crashing', () => {
        shallow(<Booking {...props}/>);
    });

    test('Booking contains `Box Office Status`', () => {
        const wrapper = shallow(<Booking {...props}/>);

        expect(wrapper.contains(<h1>Booking Seats</h1>)).toEqual(true);
    });

    test('Booking shows correct booking information', () => {
        const wrapper = shallow(<Booking {...props} />);
        const movieDetails = mockMovieData;
        const bookedSeatsStatus = {};

        movieDetails['bookedSeats'] && movieDetails['bookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'booked';
        });

        movieDetails['myBookedSeats'] && movieDetails['myBookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'myBooked';
        });

        wrapper.setState({
            movieDetails,
            seatsStatus: bookedSeatsStatus,
        });

        expect(wrapper.contains(<h1>Booking Seats - 킹스맨: 골든 서클</h1>)).toEqual(true);
        const headerListProps = wrapper.find(ListGroupItem).props();
        expect(headerListProps.header).toEqual('Theater: CGV');
        expect(headerListProps.children).toEqual('Show Time: 12PM');
        expect(wrapper.find('td.booked')).toHaveLength(4);
        expect(wrapper.find('td.my-booked')).toHaveLength(2);
    });

    test('Booking button test', () => {
        const wrapper = shallow(<Booking {...props} />);
        const movieDetails = mockMovieData;
        const bookedSeatsStatus = {};

        movieDetails['bookedSeats'] && movieDetails['bookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'booked';
        });

        movieDetails['myBookedSeats'] && movieDetails['myBookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'myBooked';
        });

        wrapper.setState({
            movieDetails,
            seatsStatus: bookedSeatsStatus,
        });

        let bookButton = wrapper.find(Button).first();
        expect(bookButton.props().disabled).toEqual(true);
        expect(bookButton.render().text()).toEqual('Book');

        // click unbooked seat
        wrapper.find('td').at(0).simulate('click');
        wrapper.find('td').at(5).simulate('click');
        bookButton = wrapper.find(Button).first();
        expect(bookButton.props().disabled).toEqual(false);
        expect(bookButton.render().text()).toEqual('Book A1, A6');

        // click myBooked seat
        wrapper.find('td.my-booked').at(0).simulate('click');
        bookButton = wrapper.find(Button).first();
        expect(bookButton.props().disabled).toEqual(false);
        expect(bookButton.render().text()).toEqual('Book A1, A6 Cancel F6');
    });

    test('Seats toggle test', () => {
        const wrapper = shallow(<Booking {...props} />);
        const movieDetails = mockMovieData;
        const bookedSeatsStatus = {};

        movieDetails['bookedSeats'] && movieDetails['bookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'booked';
        });

        movieDetails['myBookedSeats'] && movieDetails['myBookedSeats'].forEach((seat) => {
            bookedSeatsStatus[seat] = 'myBooked';
        });

        wrapper.setState({
            movieDetails,
            seatsStatus: bookedSeatsStatus,
        });

        // seats booked by others are unable to be toggled
        expect(wrapper.find('td.booked')).toHaveLength(4);
        wrapper.find('td.booked').at(0).simulate('click');
        expect(wrapper.find('td.booked')).toHaveLength(4);

        // seats booked by user are able to be toggled
        expect(wrapper.find('td.my-booked')).toHaveLength(2);
        expect(wrapper.find('td.canceled')).toHaveLength(0);
        wrapper.find('td.my-booked').at(0).simulate('click');
        expect(wrapper.find('td.my-booked')).toHaveLength(1);
        expect(wrapper.find('td.canceled')).toHaveLength(1);
    });
});
