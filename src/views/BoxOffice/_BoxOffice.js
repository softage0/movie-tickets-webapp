import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Table, ButtonToolbar, Button} from 'react-bootstrap';

import utils from '../../utils';


export class BoxOffice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
            bookingHistory: null,
        };

        this.getDashboardInfo = this.getDashboardInfo.bind(this);
        this.bookMovie = this.bookMovie.bind(this);
    }

    componentDidMount() {
        this.getDashboardInfo();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.states.app.accountInfo !== this.props.states.app.accountInfo) {
            this.getDashboardInfo(nextProps);
        }
    }

    getDashboardInfo(nextProps) {
        const props = nextProps || this.props;
        const accountInfo = props.states.app.accountInfo;
        const accountId = accountInfo && accountInfo['id'];

        utils.fetch(
            'get',
            '/api/movies',
            accountId && {
                bookerId: accountId,
            }
        ).then((movies) => {
            if (accountId) {
                utils.fetch(
                    'get',
                    '/api/bookingHistory',
                    // if account is admin type, return all histories.
                    accountInfo['type'] === 'customer' && {
                        accountId,
                    }
                ).then((history) => {
                    this.setState({
                        movies,
                        bookingHistory: history,
                    })
                });
            } else {
                this.setState({
                    movies,
                    bookingHistory: null,
                })
            }
        });
    }

    bookMovie(_id) {
        this.props.history.push('/booking/' + _id);
    }

    render() {
        const propStates = this.props.states.app;
        const {movies, bookingHistory} = this.state;

        return (
            <div>
                <h1>Box Office Status</h1>
                {
                    propStates.accountInfo && propStates.accountInfo['type'] === 'customer' ?
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Theater</th>
                                <th>Show Times</th>
                                <th>All Booked Seats</th>
                                <th>My Booked Seats</th>
                                <th>Book</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                movies.length ? movies.map((movie) => <tr key={movie['_id']}>
                                    <td>{movie['movieNm']}</td>
                                    <td>{movie['theater']}</td>
                                    <td>{movie['showTime']}</td>
                                    <td>{movie['bookedSeats'] && movie['bookedSeats'].join(', ')}</td>
                                    <td>{movie['myBookedSeats'] && movie['myBookedSeats'].join(', ')}</td>
                                    <td>
                                        <ButtonToolbar>
                                            <Button bsSize="xsmall" onClick={() => this.bookMovie(movie['_id'])}>Book/Cancel</Button>
                                        </ButtonToolbar>
                                    </td>
                                </tr>) : <tr/>
                            }
                            </tbody>
                        </Table>
                        :
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Theater</th>
                                <th>Show Times</th>
                                <th>Booked Seats</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                movies.length ? movies.map((movie) => <tr key={movie['_id']}>
                                    <td>{movie['movieNm']}</td>
                                    <td>{movie['theater']}</td>
                                    <td>{movie['showTime']}</td>
                                    <td>{movie['bookedSeats'] && movie['bookedSeats'].join(', ')}</td>
                                </tr>) : <tr/>
                            }
                            </tbody>
                        </Table>
                }
                {
                    bookingHistory && propStates.accountInfo &&
                        <div>
                            {
                                propStates.accountInfo && propStates.accountInfo['type'] === 'customer' ?
                                    <h1>My Booking History</h1>
                                    :
                                    <h1>Total Booking History (Admin)</h1>
                            }
                            <Table striped bordered condensed hover>
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Theater</th>
                                    <th>Show Times</th>
                                    <th>Booked Seats</th>
                                    <th>Canceled Seats</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    bookingHistory.map((history) => <tr key={history['_id']}>
                                        <td>{history['movieNm']}</td>
                                        <td>{history['theater']}</td>
                                        <td>{history['showTime']}</td>
                                        <td>{history['bookedSeats'] && history['bookedSeats'].join(', ')}</td>
                                        <td>{history['canceledSeats'] && history['canceledSeats'].join(', ')}</td>
                                    </tr>)
                                }
                                </tbody>
                            </Table>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(BoxOffice);
