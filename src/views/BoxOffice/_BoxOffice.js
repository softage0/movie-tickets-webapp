import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Table, ButtonToolbar, Button} from 'react-bootstrap';

import utils from '../../utils';


export class BoxOffice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
        };

        this.bookMovie = this.bookMovie.bind(this);
    }

    componentDidMount() {
        const accountInfo = this.props.states.app.accountInfo;
        const accountId = accountInfo && accountInfo['id'];

        utils.fetch(
            'get',
            '/api/movies',
            accountId && {
                bookerId: accountId,
            }
        ).then((movies) => {
            this.setState({
                movies,
            })
        })
    }

    bookMovie(_id) {
        this.props.history.push('/booking/' + _id);
    }

    render() {
        const propStates = this.props.states.app;

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
                                <th>Booked Seats</th>
                                <th>My Booked Seats</th>
                                <th>Book</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.movies.map((movie) => <tr key={movie['_id']}>
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
                                </tr>)
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
                                this.state.movies.map((movie) => <tr key={movie['_id']}>
                                    <td>{movie['movieNm']}</td>
                                    <td>{movie['theater']}</td>
                                    <td>{movie['showTime']}</td>
                                    <td>{movie['bookedSeats'] && movie['bookedSeats'].join(', ')}</td>
                                </tr>)
                            }
                            </tbody>
                        </Table>
                }

            </div>
        )
    }
}

export default withRouter(BoxOffice);
