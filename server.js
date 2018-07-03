const express = require('express');
const path = require('path');

const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// parse application/x-www-form-urlencoded
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/api/allMovies', (req, res) => {
  let allMoviesReturn = [];
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("movies");
    dbo.collection("customers").find({}).toArray(function(err, result) {
      //  res.send({express: result});
      if (err)
        throw err;
      res.send({express: JSON.stringify(result)});
      db.close();
    });
  });
});

app.get('/api/allComments', (req, res) => {
  let allMoviesReturn = [];
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("movies");
    dbo.collection("comments").find({}).toArray(function(err, result) {
      if (err)
        throw err;
      res.send({express: JSON.stringify(result)});
      db.close();
    });
  });
});
app.get('/api/movieComments', (req, res) => {
  let allMoviesReturn = [];
  let whatMovie = req.url.replace("/api/movieComments?", '');
  whatMovie = whatMovie.replace(/%22/g, '"');
  whatMovie = whatMovie.replace(/%20/g, ' ');
//  console.log("aaa"+whatMovie);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("movies");
    dbo.collection("comments").find({'title': whatMovie}).toArray(function(err, result) {
      if (err)
        throw err;
      res.send({express: JSON.stringify(result)});
      db.close();
    });
  });
});

app.post('/api/addComment', jsonParser, (req, res) => {
  let data = req.url;
  data = data.replace("/api/addComment?", '');
  data = data.replace(/%22/g, '"');
  data = data.replace(/%20/g, ' ');

  let argumentsMovie = JSON.parse(data);

  MongoClient.connect(url, function(err, db) {

    if (err) {
      throw err;
    }
    var dbo = db.db("movies");
    var addingObj = {};
    for (let property in argumentsMovie) {
      if (argumentsMovie.hasOwnProperty(property)) {
        addingObj[property] = argumentsMovie[property];
      }
    }
    dbo.collection("comments").insert(addingObj, function(err, res) {
      if (err)
        throw err;
      console.log("comments added");

    });
    db.close();
  });
});

app.post('/api/addMovie', jsonParser, (req, res) => {
let data = req.url;
data = data.replace("/api/addMovie?", '');
data = data.replace(/%22/g, '"');
data = data.replace(/%20/g, ' ');

let argumentsMovie = JSON.parse(data);

let i = 1;
for (a in argumentsMovie.Ratings) {
  if (argumentsMovie.Ratings.hasOwnProperty(a)) {
    argumentsMovie["Rating" + i] = argumentsMovie.Ratings[a].Source + ":" + argumentsMovie.Ratings[a].Value;
  }
  i++;
}
argumentsMovie.Ratings = null;

MongoClient.connect(url, function(err, db) {

  if (err) {
    throw err;
  }
  var dbo = db.db("movies");

  dbo.collection("customers").find({'Title': argumentsMovie.Title}).toArray(function(err, result) {

    if (err) {
      throw err;
    }
    if (result == "") {

      var addingObj = {};
      for (let property in argumentsMovie) {
        if (argumentsMovie.hasOwnProperty(property)) {
          addingObj[property] = argumentsMovie[property];
        }
      }
      dbo.collection("customers").insert(addingObj, function(err, res) {
        if (err)
          throw err;
        console.log("Movie added");

      });

    }
    db.close();
  });

});
res.send("true");
});


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
