import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {ListGroup, ListGroupItem, Table, ButtonToolbar, Button} from 'react-bootstrap';
import swal from 'sweetalert2';

import utils from '../../utils';


export class Booking extends Component {
    constructor(props) {
        super(props);

        this.SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        this.SEAT_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        this.state = {
            movieDetails: null,
            seatsStatus: {},
            ajaxFetching: false,
        };

        this.toggleSelection = this.toggleSelection.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.bookSeats = this.bookSeats.bind(this);
    }

    componentDidMount() {
        const propStates = this.props.states.app;

        if (!propStates.accountInfo || propStates.accountInfo['type'] !== 'customer') {
            this.props.history.push('/');
        } else {
            this.getMovie();
        }
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
        this.setState({
            ajaxFetching: true,
        }, () => {
            utils.fetch(
                'get',
                '/api/movies/' + this.props.match.params['_id'] + '/' + this.props.states.app.accountInfo['id'],
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
                    ajaxFetching: false,
                })
            })
        });
    }

    bookSeats() {
        const {seatsStatus} = this.state;
        const overallBookingSeats = [];
        const bookingSeats = [];
        const cancelingSeats = [];

        for (let key in seatsStatus) {
            if (seatsStatus.hasOwnProperty(key)) {
                const value = seatsStatus[key];

                if (value === 'selected' || value === 'myBooked') {
                    overallBookingSeats.push(key);
                }

                if (value === 'selected') {
                    bookingSeats.push(key);
                }

                if (value === 'canceled') {
                    cancelingSeats.push(key);
                }
            }
        }

        this.setState({
            ajaxFetching: true,
        }, () => {
            utils.fetch(
                'post',
                '/api/booking/' + this.props.match.params['_id'] + '/' + this.props.states.app.accountInfo['id'],
                {
                    seats: overallBookingSeats,
                    bookingSeats,
                    cancelingSeats,
                }
            ).then((response) => {
                if (!response || !response.status) {
                    this.getMovie();
                    swal({
                        title: 'Book/Cancel succeeded',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000,
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: 'Book/Cancel failed',
                        type: 'warning',
                    });
                    this.setState({
                        ajaxFetching: false,
                    });
                }
            });
        });

    }

    render() {
        const {movieDetails, seatsStatus, ajaxFetching} = this.state;
        const selectedSeats = [];
        const canceledSeats = [];

        for (let key in seatsStatus) {
            if (seatsStatus.hasOwnProperty(key)) {
                const value = seatsStatus[key];

                if (value === 'selected') {
                    selectedSeats.push(key);
                }
                if (value === 'canceled') {
                    canceledSeats.push(key);
                }
            }
        }

        return (
            <div className="pos-r">
                {
                    ajaxFetching &&
                    <div className="loading-wrapper">
                        <div className="loading-indicator"/>
                    </div>
                }
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
                                                       className='booked'>
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
