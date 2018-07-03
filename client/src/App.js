import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    responseLocal: '',
    movieComments: '',
    responseExternal: '',
    isLoading: true,
    showMovie: false,
    showComments: false
  };
  constructor(props) {

    super();

    this.allMoviesArr = [];
    this.movieDataShow = [];
    this.state = {title:''};
  }
  onMovieClick(item, e) {
    console.log(item);
    this.setState({showMovie: true, showComments: false});

    // temp = JSON.parse(item);
    //let temp = item.map(this.mapJsonMovie);
    let allView = [];
    for (let property in item) {
      if (property != "_id" && property != "Poster" && property != "Response") {
        allView.push(<li>{property}: {item[property]}</li>);
      }
    }

    this.setState({responseLocal: allView});
    this.setState({title:item.Title});
    this.callApiCommentsMovie(item.Title).then(res => this.recievedComments(res.express, false)).catch(err => console.log(err));
    //commentsTemp = JSON.stringify(commentsTemp)

  }
  recievedComments(data, mainPage) {
    //console.log("c"+data);
    //let commentsTemp = this.callApiCommentsMovie(data.Title);
    let commentsTemp = JSON.parse(data);
    commentsTemp = commentsTemp.map(this.mapJsonComment);
    console.log("bbbb" + commentsTemp);
    if(mainPage) {
      this.setState({responseLocal: commentsTemp});
    } else {
      this.setState({movieComments: commentsTemp});
    }
  }
  mapJsonComment(data, i) {
    let allView = [];
    let a = <li key={i}>Author: {data.author}</li>;
    let b = <li key={i + 1}>{data.title} - {data.content}</li>;
    allView.push(a);
    allView.push(b);
    return <label>{allView}</label>;

  }
  mapJson(data, i) {
    //  this.childKey++;
    let allView = [];
    let a = <img width="100px" src={data.Poster} />;
    let b = <li key={i + 1}>{data.Title}
      ({data.Year})</li>;
    let c = <li key={i + 2}>{data.Genre}</li>;
    let d = <li key={i + 3}>More</li>;
    allView.push(a);
    allView.push(b);
    allView.push(c);
    allView.push(d);
    let boundItemClick = this.onMovieClick.bind(this, data);
    return <label onClick={boundItemClick}>{allView}</label>;
  }
  recievedMovies(data) {
    let temp = JSON.parse(data);
    temp = temp.map(this.mapJson, this);
    this.setState({responseLocal: temp});
  }
  componentDidMount() {
    this.callApiMovies().then(res => this.recievedMovies(res.express)).catch(err => console.log(err));

    this.callExternalApi("Fight Club");
    this.callApiCommentsMovie("Fight Club");

  }
  callExternalApi = async (tittle) => {
    tittle = tittle.trim();
    tittle.replace(/ /g, '+');
    this.setState({isLoading: true});
    fetch('https://www.omdbapi.com/?apikey=1ce9ae26&t==' + tittle).then((response) => response.json()).then((responseJson) => {

      //this.allMoviesArr = responseJson.Year;
      this.addInternalMovie(responseJson).then(res => this.setState({isLoading: false})).catch(err => console.log(err));;
      //this.setState({isLoading: false});
    }).catch((error) => {
      console.error(error);
    });
  };
  addInternalMovie = async (data) => {
    fetch('/api/addMovie?' + JSON.stringify(data), {
      method: 'post',
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json();
    });
  }
  addInternalComment = async (event) => {
    let data = {};
    data["author"]=this.refs['name'].value;
    data["content"]=this.refs['content'].value;
    data["title"]= this.state.title;

    let allView = [];
    let a = <li>Author: {data.author}</li>;
    let b = <li>{data.content}</li>;
    let temp = this.state.movieComments;
    allView.push(a);
    allView.push(b);
    temp.push(<label>{allView}</label>);
    this.setState({movieComments:temp});

    fetch('/api/addComment?' + JSON.stringify(data), {
      method: 'post',
      body: JSON.stringify(data)
    }).then(function(response) {
      console.log(response.json);
      return response.json();
    });
  }

  callApiMovies = async () => {
    const response = await fetch('/api/allMovies');
    const body = await response.json();
    if (response.status !== 200)
      throw Error(body.message);
    return body;
  };
  callApiComments = async () => {
    const response = await fetch('/api/allComments');
    const body = await response.json();
    if (response.status !== 200)
      throw Error(body.message);
    return body;
  };
  callApiCommentsMovie = async (movieToShow) => {
    const response = await fetch('/api/movieComments?' + movieToShow);
    const body = await response.json();
    if (response.status !== 200)
      throw Error(body.message);
    return body;
  };

  showCommentsAll = async() => {
    this.setState({showComments:!this.state.showComments});
    if(this.state.showComments) {
      this.callApiComments().then(res => this.recievedComments(res.express, true)).catch(err => console.log(err));

    } else {
      this.callApiMovies().then(res => this.recievedMovies(res.express)).catch(err => console.log(err));

    }
  }

  goMain = () => {
    this.callApiMovies().then(res => this.recievedMovies(res.express)).catch(err => console.log(err));

    this.setState({showMovie:false});
  }


  addMovieHere = () => {
    this.callExternalApi(this.refs['addMovieTitle'].value);
  }

  render() {
    const moviePage = (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Movie data</h1>
        <button onClick={this.goMain}>Main Page</button>
      </header>
      <p className="Movies">{this.state.responseLocal}</p>
      Comments:
      <p className="Movies">{this.state.movieComments}</p>
      <p>Add comment:</p>
      <p>Author:
      <input ref="name" type="text" name="name" /><br /></p>
      <p>Content:
      <input ref="content" type="text" name="content" /><br /></p>
      <button onClick={this.addInternalComment}>Add</button>
    </div>);
    const allCommentsPage = (<div>c</div>);
    const allMoviesPage = (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Movies database</h1>
        <button onClick={this.showCommentsAll}>All comments</button>
      </header>
      <br /><br />
      <input ref="addMovieTitle" type="text" name="titleAdd" /><br />
      <button onClick={this.addMovieHere}>Add</button>
      <p className="Movies">{this.state.responseLocal}</p>
    </div>);
    return this.state.showMovie
        ? moviePage
        : allMoviesPage;
  }
}

export default App;
