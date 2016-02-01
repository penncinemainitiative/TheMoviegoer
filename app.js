'use strict';

var express = require('express');
var helmet = require('helmet');
var app = express();

var http = require('http');
var compression = require('compression');
var path = require('path');
var session = require('express-session');
var multer = require('multer');
var s3 = require('multer-s3');
var bodyParser = require('body-parser');
var fs = require('fs');
var async = require('async');
var secretObj = JSON.parse(fs.readFileSync('json/secret.json', 'utf8'));

app.use(compression());
app.use(helmet());

app.use(multer({dest: './uploads/', includeEmptyFields: true}).single('photo'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var engineOptions = { transformViews: false };
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine(engineOptions));

app.use(session({
  secret: secretObj.secret,
  resave: true,
  saveUninitialized: true,
  login: false
}));

app.get('/*', function(req, res, next) {
  if (req.headers && req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  res.locals.login = req.session.login;
  res.locals.name = req.session.name;
  res.locals.username = req.session.username;
  res.locals.isEditor = req.session.isEditor;
  res.locals.inConsole = false;
  console.log(req.method + ' ' + req.path + ' ' + new Date() + ' ' + req.session.username);
  next();
});

app.use('/', require('./routes/index'));
app.use('/console', require('./routes/console'));
app.use('/writer', require('./routes/writer'));
app.use('/article', require('./routes/article'));
app.use('/events', require('./routes/events'));
app.use('/search', require('./routes/search'));

app.get('*', function (req, res) {
  res.status(404);
  res.render('404');
});

var server = app.listen(8080, function () {
  var port = server.address().port;
  console.log('Example app listening at http://localhost:%s', port);
});
