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
            movieDetails: {},
            ajaxFetching: false,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const {movieDetails} = this.props;

        this.setState({
            ajaxFetching: true,
        }, () => {
            // get active movie list from `kobis.or.kr`
            utils.fetch(
                'get',
                '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json',
                {
                    key: process.env.REACT_APP_KOBIS_KEY,
                    // 최근날짜의 경우 시간대에 따라 Open API에서 영화정보를 보내주지 않는 문제가 있어 날짜를 고정
                    targetDt: '20171005' || utils.getYyyymmdd(),
                },
            ).then((response) => {
                this.setState({
                    boxOfficeList: response['boxOfficeResult']['dailyBoxOfficeList'],
                }, () => {
                    if (movieDetails) {
                        this.setState({
                            movieDetails,
                            ajaxFetching: false,
                        }, () => {
                            if (this.props.onChange) {
                                this.props.onChange(this.state.movieDetails);
                            }
                        });
                    } else {
                        this.setState({
                            ajaxFetching: false,
                        });
                    }
                })
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        const {movieDetails} = nextProps;

        if (movieDetails !== this.props.movieDetails) {
            this.setState({
                movieDetails,
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.movieDetails);
                }
            });
        }
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
        const {movieDetails, ajaxFetching} = this.state;

        return (
            <Form className="pos-r" componentClass="fieldset" horizontal>
                {
                    ajaxFetching &&
                    <div className="loading-wrapper">
                        <div className="loading-indicator"/>
                    </div>
                }
                <FieldGroup
                    id="movieCd"
                    value={movieDetails['movieCd']}
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
                    value={movieDetails['theater']}
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
                    value={movieDetails['showTime']}
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
