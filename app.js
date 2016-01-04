'use strict';

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var session = require('express-session');
var multer = require('multer');
var s3 = require('multer-s3');
var bodyParser = require('body-parser');
var fs = require('fs');
var async = require('async');
var secretObj = JSON.parse(fs.readFileSync('json/secret.json', 'utf8'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(multer({dest: './uploads/', includeEmptyFields: true}).single('photo'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: secretObj.secret,
  resave: true,
  saveUninitialized: true,
  login: false
}));

app.use(function(req, res, next) {
  res.locals.login = req.session.login;
  res.locals.name = req.session.name;
  res.locals.username = req.session.username;
  res.locals.isEditor = req.session.isEditor;
  res.locals.inConsole = false;
  next();
});

app.use('/', require('./routes/index'));
app.use('/console', require('./routes/console'));
app.use('/author', require('./routes/author'));
app.use('/article', require('./routes/article'));
app.use('/events', require('./routes/events'));

var server = app.listen(8080, function () {
  var port = server.address().port;
  console.log('Example app listening at http://localhost:%s', port);
});
