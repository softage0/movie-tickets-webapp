import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

import utils from '../utils';
import FieldGroup from './FieldGroup';


class MovieEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boxOfficeList: [],
            theaters: ['CGV', 'Lotte Cinema', 'Megabox'],
            showTimes: ['7AM', '12PM', '3PM', '9PM'],
            movieDetails: null,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // get active movie list from `kobis.or.kr`
        utils.fetch(
            'get',
            '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json',
            {
                key: process.env.REACT_APP_KOBIS_KEY,
                targetDt: '20171005' || utils.getYyyymmdd(),
            },
        ).then((response) => {
            this.setState({
                boxOfficeList: response['boxOfficeResult']['dailyBoxOfficeList'],
            })
        })
    }

    handleChange(event) {
        const target = event.target;
        const movieDetails = {
            [target.id]: target.value,
        };

        if (target.id === 'movieCd') {
            const elem = document.getElementById("movieCd");
            movieDetails['movieNm'] = elem.options[elem.selectedIndex].text
        }

        this.setState({
            movieDetails: Object.assign({}, this.state.movieDetails, movieDetails)
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.movieDetails);
            }
        });

    }

    render() {
        return (
            <Form componentClass="fieldset" horizontal>
                <FieldGroup
                    id="movieCd"
                    type="text"
                    label="Title"
                    componentClass="select"
                    onChange={this.handleChange}>
                    <option value="">select Movie</option>
                    {
                        this.state.boxOfficeList && this.state.boxOfficeList.map((movie) =>
                            <option key={movie['movieCd']} value={movie['movieCd']}>{movie['movieNm']}</option>)
                    }
                </FieldGroup>
                <FieldGroup
                    id="theater"
                    type="text"
                    label="Theater"
                    componentClass="select"
                    onChange={this.handleChange}>
                    <option value="">select Theater</option>
                    {
                        this.state.theaters && this.state.theaters.map((theater) =>
                            <option key={theater} value={theater}>{theater}</option>)
                    }
                </FieldGroup>
                <FieldGroup
                    id="showTime"
                    type="text"
                    label="Show Time"
                    componentClass="select"
                    onChange={this.handleChange}>
                    <option value="">select Show Time</option>
                    {
                        this.state.showTimes && this.state.showTimes.map((showTime) =>
                            <option key={showTime} value={showTime}>{showTime}</option>)
                    }
                </FieldGroup>
            </Form>
        )
    }
}

export default MovieEditor;
