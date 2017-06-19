var express = require('express');
var app = express();
var imdb = require('imdb-api');
var config = require('../db/config');
var movies = require('../db/schema/movie');
var accounts = require('../db/schema/account');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname.slice(0, __dirname.length - 6)));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname.slice(0, __dirname.length - 6) + 'index.html')
});

app.get('/signin', function (req, res) {
  res.render('/signin');
});

app.post('/signin', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  accounts.findOne({username: username}, (err, user) => {
    if(err) throw err;
    if (!user) {
      res.send('Incorrect password or username.');
      res.redirect('/login');
    } else {
      accounts.comparePassword(password, user.password, function(err, match) {
        if (err) throw err;
        if (match) {
          //create session
        } else {
          res.send('Incorrect password or username.');
          res.redirect('/login');
        }
      });
      res.redirect('/')
    }
  })
})

app.get('/signup', function (req, res) {
  res.render('/signup');
});

app.post('/signup', function (req, res) {
  console.log("REQ BODY here!", req.body)
  var username = req.body.username;
  var password = req.body.password;

  accounts.findOne({username: username.toString()}, (err, user) => {
    if (err) throw err;
    if (user) {
      res.send('Username already exists');
      res.redirect('/signup');
    } else {
      accounts.insertOne({username: username, password: password}, (err, user) => {
        if (err) throw err;
        res.send('Account created.');
        res.redirect('/');
      });
    }
  });
})

module.exports = app;