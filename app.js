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

app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({dest: './uploads/', includeEmptyFields: true}).single('photo'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views/stylesheets'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/views/js'));
app.use(express.static(__dirname + '/views/fonts'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: secretObj.secret,
  resave: true,
  saveUninitialized: true,
  login: false
}));

app.use('/', require('./routes/index'));
app.use('/console', require('./routes/console'));
app.use('/account', require('./routes/account'));
app.use('/article', require('./routes/article'));
app.use('/events', require('./routes/events'));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
