import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {ListGroup, ListGroupItem, Table, ButtonToolbar, Button} from 'react-bootstrap';

import utils from '../../utils';


export class Booking extends Component {
    constructor(props) {
        super(props);

        this.SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        this.SEAT_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        this.state = {
            movieDetails: null,
            seatsStatus: {},
        };

        this.toggleSelection = this.toggleSelection.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.bookSeats = this.bookSeats.bind(this);
    }

    componentDidMount() {
        const propStates = this.props.states.app;

        if (!propStates.accountInfo || propStates.accountInfo['type'] !== 'customer') {
            // this.props.history.push('/');
        }

        this.getMovie();
    }

    toggleSelection(seatId) {
        let seatStatus;
        if (this.state.seatsStatus[seatId] === 'selected') {
            seatStatus = null;
        } else if (!this.state.seatsStatus[seatId]) {
            seatStatus = 'selected';
        }

        if (this.state.seatsStatus[seatId] === 'myBooked') {
            seatStatus = 'canceled';
        } else if (this.state.seatsStatus[seatId] === 'canceled') {
            seatStatus = 'myBooked';
        }

        this.setState({
            seatsStatus: Object.assign({}, this.state.seatsStatus, {
                [seatId]: seatStatus,
            })
        })
    }

    getMovie() {
        utils.fetch(
            'get',
            '/api/movies/' + this.props.match.params['_id'] + '/wonju',
            // '/api/movies/' + this.props.match.params['_id'] + '/' + this.props.states.app.accountInfo['id'],
        ).then((movieDetails) => {
            const bookedSeatsStatus = {};

            movieDetails['bookedSeats'] && movieDetails['bookedSeats'].forEach((seat) => {
                bookedSeatsStatus[seat] = 'booked';
            });

            movieDetails['myBookedSeats'] && movieDetails['myBookedSeats'].forEach((seat) => {
                bookedSeatsStatus[seat] = 'myBooked';
            });

            this.setState({
                movieDetails,
                seatsStatus: bookedSeatsStatus,
            })
        })
    }

    bookSeats() {
        const bookingSeats = [];

        for (let [key, value] of Object.entries(this.state.seatsStatus)) {
            if (value === 'selected' || value === 'myBooked') {
                bookingSeats.push(key);
            }
        }

        utils.fetch(
            'post',
            '/api/booking/' + this.props.match.params['_id'] + '/wonju',
            // '/api/booking/' + this.props.match.params['_id'] + '/' + this.props.states.app.accountInfo['id'],
            {
                seats: bookingSeats,
            }
        ).then(() => {
            this.getMovie();
        })
    }

    render() {
        const {movieDetails, seatsStatus} = this.state;
        const selectedSeats = [];
        const canceledSeats = [];

        for (let [key, value] of Object.entries(seatsStatus)) {
            if (value === 'selected') {
                selectedSeats.push(key);
            }
            if (value === 'canceled') {
                canceledSeats.push(key);
            }
        }

        return (
            <div>
                {movieDetails ?
                    <div>
                        <h1>Booking Seats - {movieDetails.movieNm}</h1>
                        <ListGroup>
                            <ListGroupItem header={'Theater: ' + movieDetails.theater}>
                                {'Show Time: ' + movieDetails.showTime}
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                    :
                    <h1>Booking Seats</h1>
                }
                <div>
                    Please select the seats you want to book or cancel.
                    <Button bsStyle="primary" className='booking-btn'
                            disabled={selectedSeats.length === 0 && canceledSeats.length === 0}
                            onClick={this.bookSeats}
                    >
                        {selectedSeats.length === 0 && canceledSeats.length === 0 && 'Book'}
                        {selectedSeats.length !== 0 && 'Book ' + selectedSeats.join(', ')}
                        {canceledSeats.length !== 0 && ' Cancel ' + canceledSeats.join(', ')}
                    </Button>
                </div>
                <Table className='booking-seats' bordered condensed>
                    <thead>
                    <tr>
                        <th colSpan={this.SEAT_ROWS.length}>SCREEN</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.SEAT_ROWS.map((row) => <tr key={row}>
                            {
                                this.SEAT_COLUMNS.map((column) => {
                                    const seatId = row + column;

                                    switch (seatsStatus[seatId]) {
                                        case 'selected':
                                            return <td key={column}
                                                       className='selected'
                                                       onClick={() => this.toggleSelection(seatId)}>
                                                {seatId}
                                            </td>;
                                        case 'myBooked':
                                            return <td key={column}
                                                       className='my-booked'
                                                       onClick={() => this.toggleSelection(seatId)}>
                                                {seatId}
                                            </td>;
                                        case 'canceled':
                                            return <td key={column}
                                                       className='canceled'
                                                       onClick={() => this.toggleSelection(seatId)}>
                                                {seatId}
                                            </td>;
                                        case 'booked':
                                            return <td key={column}
                                                       className='booked'
                                                       onClick={() => this.toggleSelection(seatId)}>
                                                {seatId}
                                            </td>;
                                        default:
                                            return <td key={column}
                                                       onClick={() => this.toggleSelection(seatId)}>
                                                {seatId}
                                            </td>;
                                    }
                                })
                            }
                        </tr>)
                    }
                    </tbody>
                </Table>
                <ButtonToolbar className='booking-legend'>
                    <Button bsStyle="primary" bsSize='small'>Selected</Button>
                    <Button bsStyle="success" bsSize='small'>My Booked</Button>
                    <Button bsStyle="danger" bsSize='small'>Canceled</Button>
                    <Button bsStyle="info" bsSize='small'>Booked</Button>
                </ButtonToolbar>
            </div>
        )
    }
}

export default withRouter(Booking);
