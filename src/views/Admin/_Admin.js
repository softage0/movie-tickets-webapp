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
        this.getMovies = this.getMovies.bind(this);
        this.addMovie = this.addMovie.bind(this);
        this.editMovie = this.editMovie.bind(this);
        this.deleteMovie = this.deleteMovie.bind(this);
        this.saveMovie = this.saveMovie.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    componentDidMount() {
        const propStates = this.props.states.app;

        if (!propStates.accountInfo || propStates.accountInfo['type'] !== 'admin') {
            this.props.history.push('/');
        }

        this.getMovies();
    }

    onChangeMovieDetails(movieDetails) {
        this.setState({
            movieDetails,
        });
    }

    getMovies() {
        utils.fetch(
            'get',
            '/api/movies',
        ).then((movies) => {
            this.setState({
                movies,
            })
        })
    }

    addMovie() {
        this.setState({
            mode: 'add',
            movieDetails: null,
        })
    }

    editMovie(_id) {
        this.setState({
            mode: 'edit',
            movieDetails: this.state.movies.filter((movie) => movie['_id'] === _id)[0],
        })
    }

    deleteMovie(_id) {
        utils.fetch(
            'delete',
            '/api/movies/' + _id,
        ).then((response) => {
            if(!response || !response.status) {
                this.cancelEdit();
                this.getMovies();
            }
        });
    }

    saveMovie() {
        const movieDetails = this.state.movieDetails;

        if (this.state.mode === 'add') {
            utils.fetch(
                'post',
                '/api/movies/',
                movieDetails,
            ).then((response) => {
                if(!response || !response.status) {
                    this.cancelEdit();
                    this.getMovies();
                }
            });
        } else {
            utils.fetch(
                'put',
                '/api/movies/' + movieDetails['_id'],
                movieDetails,
            ).then((response) => {
                if(!response || !response.status) {
                    this.cancelEdit();
                    this.getMovies();
                }
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
        let movies = this.state.movies;

        if (this.state.mode === 'edit') {
            const editingId = this.state.movieDetails['_id'];
            movies = [];

            this.state.movies.forEach((movie) => {
                movies.push(movie);
                if (movie['_id'] === editingId) {
                    movies.push({
                        type: 'editor',
                    })
                }
            })

        }

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
                        movies.map((movie) => {
                            if (movie['type'] && movie['type'] === 'editor') {
                                return <tr key={'editor'} className='movie-editor'>
                                    <td colSpan={4}>
                                        <MovieEditor
                                            movieDetails={this.state.movieDetails}
                                            onChange={this.onChangeMovieDetails}
                                        />
                                    </td>
                                </tr>
                            } else {
                                return <tr key={movie['_id']}>
                                    <td>{movie['movieNm']}</td>
                                    <td>{movie['theater']}</td>
                                    <td>{movie['showTime']}</td>
                                    <td>
                                        <ButtonToolbar>
                                            <Button bsSize="xsmall" onClick={() => this.editMovie(movie['_id'])}>Edit</Button>
                                            <Button bsSize="xsmall" onClick={() => this.deleteMovie(movie['_id'])}>Delete</Button>
                                        </ButtonToolbar>
                                    </td>
                                </tr>
                            }
                        })
                    }
                    {
                        this.state.mode === 'add' &&
                            <tr className='movie-editor'>
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
