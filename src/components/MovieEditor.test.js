import React from 'react';
import {shallow} from 'enzyme';

import FieldGroup from './FieldGroup';
import MovieEditor from './MovieEditor';

const mockMovieList = [
    {
        "rnum": "2",
        "rank": "2",
        "rankInten": "0",
        "rankOldAndNew": "OLD",
        "movieCd": "20175222",
        "movieNm": "킹스맨: 골든 서클",
        "openDt": "2017-09-27",
        "salesAmt": "2701904100",
        "salesShare": "21.5",
        "salesInten": "193115500",
        "salesChange": "7.7",
        "salesAcc": "30175372796",
        "audiCnt": "306412",
        "audiInten": "25613",
        "audiChange": "9.1",
        "audiAcc": "3683961",
        "scrnCnt": "944",
        "showCnt": "4009"
    }, {
        "rnum": "3",
        "rank": "3",
        "rankInten": "0",
        "rankOldAndNew": "OLD",
        "movieCd": "20172742",
        "movieNm": "범죄도시",
        "openDt": "2017-10-03",
        "salesAmt": "2305391600",
        "salesShare": "18.3",
        "salesInten": "567603700",
        "salesChange": "32.7",
        "salesAcc": "5677580000",
        "audiCnt": "277219",
        "audiInten": "70761",
        "audiChange": "34.3",
        "audiAcc": "678497",
        "scrnCnt": "871",
        "showCnt": "2966"
    }
];

const mockMovieData = {
    "_id": "59d8ad68c112793823f8a0a7",
    "movieCd": "20175222",
    "movieNm": "킹스맨: 골든 서클",
    "theater": "CGV",
    "showTime": "12PM",
    "bookedSeats": ["F6", "F7", "D6", "D7", "E6", "E7"],
    "myBookedSeats": ["F6", "F7"]
};


describe('MovieEditor Test', () => {
    test('renders without crashing', () => {
        shallow(<MovieEditor/>);
    });

    test('MovieEditor component check', () => {
        const wrapper = shallow(<MovieEditor />);

        expect(wrapper.find(FieldGroup)).toHaveLength(3);
        expect(wrapper.find(FieldGroup).at(0).props().id).toEqual('movieCd');
        expect(wrapper.find(FieldGroup).at(1).props().id).toEqual('theater');
        expect(wrapper.find(FieldGroup).at(2).props().id).toEqual('showTime');
    });

    test('MovieEditor with state', () => {
        const wrapper = shallow(<MovieEditor />);
        wrapper.setState({
            boxOfficeList: mockMovieList,
            movieDetails: mockMovieData,
        });

        expect(wrapper.find(FieldGroup)).toHaveLength(3);
        expect(wrapper.find(FieldGroup).at(0).props().value).toEqual('20175222');
        expect(wrapper.find(FieldGroup).at(1).props().value).toEqual('CGV');
        expect(wrapper.find(FieldGroup).at(2).props().value).toEqual('12PM');
    });
});
