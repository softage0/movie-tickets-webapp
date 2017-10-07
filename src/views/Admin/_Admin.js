import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Table, ButtonToolbar, Button} from 'react-bootstrap';

import utils from '../../utils';
import MovieEditor from '../../components/MovieEditor';


export class BoxOffice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'view',
            movies: [],
            movieDetails: null,
        };

        this.onChangeMovieDetails = this.onChangeMovieDetails.bind(this);
        this.addMovie = this.addMovie.bind(this);
        this.editMovie = this.editMovie.bind(this);
        this.deleteMovie = this.deleteMovie.bind(this);
        this.saveMovie = this.saveMovie.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    componentDidMount() {
        const propStates = this.props.states.app;

        if (!propStates.accountInfo || propStates.accountInfo['type'] !== 'admin') {
            // this.props.history.push('/');
        }

        utils.fetch(
            'get',
            'api/movies',
        ).then((movies) => {
            movies = [
                {
                    title: 'Kill Bill',
                    theaters: ['Lotte', 'CGV'],
                    showTimes: ['1pm', '2pm']
                },
                {
                    title: 'Kill Bill 2',
                    theaters: ['Lotte'],
                    showTimes: ['1pm', '2pm']
                }
            ];

            this.setState({
                movies,
            })
        })

    }

    onChangeMovieDetails(movieDetails) {
        console.log(movieDetails);
        this.setState({
            movieDetails,
        });
    }

    addMovie() {
        this.setState({
            mode: 'add',
            movieDetails: null,
        })
    }

    editMovie(_id) {
    }

    deleteMovie(_id) {

    }

    saveMovie() {
        const movieDetails = this.state.movieDetails;

        if (this.state.mode === 'add') {
            utils.fetch(
                'post',
                'api/movie/',
                movieDetails,
            ).then((response) => {
                console.log(response);
            });
        } else {
            utils.fetch(
                'put',
                'api/movie/' + movieDetails['_id'],
                movieDetails,
            ).then((response) => {
                console.log(response);
            });
        }
    }

    cancelEdit() {
        this.setState({
            mode: 'view',
            movieDetails: null,
        })
    }

    render() {
        return (
            <div>
                <h1>Admin Page - Movie Management</h1>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Theater</th>
                        <th>Show Times</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.movies.map((movie) => <tr key={movie['_id']}>
                            <td>{movie['title']}</td>
                            <td>{movie['theaters']}</td>
                            <td>{movie['showTimes']}</td>
                            <td>
                                <ButtonToolbar>
                                    <Button bsSize="xsmall" onClick={() => this.editMovie(movie['_id'])}>Edit</Button>
                                    <Button bsSize="xsmall" onClick={() => this.deleteMovie(movie['_id'])}>Delete</Button>
                                </ButtonToolbar>
                            </td>
                        </tr>)
                    }
                    {
                        this.state.mode === 'add' &&
                            <tr>
                                <td colSpan={4}>
                                    <MovieEditor
                                        onChange={this.onChangeMovieDetails}
                                    />
                                </td>
                            </tr>
                    }
                    </tbody>
                </Table>
                {
                    this.state.mode === 'view' ?
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={this.addMovie}>Add Movie</Button>
                        </ButtonToolbar>
                        :
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={this.saveMovie}>Save</Button>
                            <Button onClick={this.cancelEdit}>Cancel</Button>
                        </ButtonToolbar>
                }
            </div>
        )
    }
}

export default withRouter(BoxOffice);
