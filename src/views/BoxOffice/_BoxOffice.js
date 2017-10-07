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
        utils.fetch(
            'get',
            '/api/movies',
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
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Theater</th>
                        <th>Show Times</th>
                        {
                            propStates.accountInfo && propStates.accountInfo['type'] === 'customer' &&
                            <th>Book</th>
                        }

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.movies.map((movie) => <tr key={movie['_id']}>
                            <td>{movie['movieNm']}</td>
                            <td>{movie['theater']}</td>
                            <td>{movie['showTime']}</td>
                                {
                                    propStates.accountInfo && propStates.accountInfo['type'] === 'customer' &&
                                    <td>
                                        <ButtonToolbar>
                                            <Button bsSize="xsmall" onClick={() => this.bookMovie(movie['_id'])}>Book</Button>
                                        </ButtonToolbar>
                                    </td>
                                }
                        </tr>)
                    }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default withRouter(BoxOffice);
