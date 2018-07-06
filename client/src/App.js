import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {connect, Provider} from "react-redux";
import {addComment, addInternalMovie, callApiMovies, callApiComments, callApiCommentsMovie} from "./reduxData/fetchAPI";
import {moviesLoader, commentsLoader} from "./reduxData/apiLoader";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  // key name same as the carefully renamed default export
  movies: moviesLoader,
  comments: commentsLoader
});
const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

class App extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (<Provider store={store}>
      <MovieData/>
    </Provider>);
  }
}

const mapStateToProps = state => ({comments: state.comments.items, movies: state.movies.items, loading: state.movies.loading, error: state.movies.error});

class MovieData extends React.Component {
  constructor(props) {
    super();
    this.state = {
      movieData: [],
      showOneMovie: false,
      showComments: false
    };
  }
  componentDidMount() {
    this.props.dispatch(callApiMovies());
  }

  oneMovie = (item, e) => {
    let allView = [];
    allView.push(<img src={item["Poster"]}></img>);
    for (let property in item) {
      if (property != "_id" && property != "Poster" && property != "Response") {
        allView.push(<li>{property}: {item[property]}</li>);
      }
    }

    this.showCommentsMovie(item.Title);

    this.setState({movieData: allView, showOneMovie: true});
  }

  showCommentsAll = () => {
    this.props.dispatch(callApiComments());
    this.setState({
      showOneMovie: false,
      showComments: !this.state.showComments
    });
  }
  showCommentsMovie = () => {
    this.props.dispatch(callApiCommentsMovie());
  }
  addMovie = async () => {
    let title = this.refs['addMovieTitle'].value;
    await this.props.dispatch(addInternalMovie(title));
    if(!this.state.showComments) {
      this.props.dispatch(callApiMovies());
    }
  }
  addComment = async () => {
    let data = {};
    data["author"] = this.refs['name'].value;
    data["content"] = this.refs['content'].value;
    data["title"] = this.state.title;
    await this.props.dispatch(addComment(JSON.stringify(data)));
    if(this.state.showComments) {
      this.props.dispatch(callApiComments());
    }
  }

  render() {
    const {error, loading, movies} = this.props;

    if (error) {
      return <div>Error! {error.message}</div>;
    }

    if (loading) {
      return <div>Loading movies...</div>;
    }
    if (this.state.showOneMovie) {
      return (<p>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Movies database</h1>
            <button onClick={this.showCommentsAll}>All comments</button>
          </header>

          <br/><br/>
          <input ref="addMovieTitle" type="text" name="titleAdd"/><br/>
          <button onClick={this.addMovie}>Add</button>
          <p>{this.state.movieData}</p>
          {
            (this.props.comments.map((item, i) => (<li key={i}>
              <p>{item.author}
                on {item.title}
              </p>
              <p>{item.content}
              </p>
              <br/>
            </li>)))
          }
        </div>
      </p>);
    }
    return (
    <p>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Movies database</h1>
          <button onClick={this.showCommentsAll}>All comments</button>
        </header>

        <br/><br/>
        <input ref="addMovieTitle" type="text" name="titleAdd"/><br/>
        <button onClick={this.addMovie}>Add</button>

      </div>
      {
        !this.state.showComments
          ? (this.props.movies.map((item, i) => (<li onClick={e => this.oneMovie(item, e)} key={i}>
            <img width="100px" src={item.Poster}/>
            <p>{item.Title}
              ({item.Year})</p>
            <p>{item.Genre}</p>
            {
              this.state.showOneMovie
                ? <p>{item.Genre}</p>
                : ""
            }
          </li>)))
          : (this.props.comments.map((item, i) => (<li key={i}>
            <p>{item.author}
              on {item.title}
            </p>
            <p>{item.content}
            </p>
            <br/>
          </li>)))
      }</p>);
  }
}

MovieData = connect(mapStateToProps)(MovieData);

export default App;
