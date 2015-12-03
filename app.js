var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'ejs');

app.use( express.static( path.join( __dirname, 'public' )));
app.use(express.static(__dirname + '/views/stylesheets'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/views/js'));

app.get('/', function (req, res) {
  var t = 'The Moviegoer';
  res.render('index', { 
  	title: t,
  	login: false,
  	console: false
  });
});

app.get('/console', function (req, res) {
  var t = 'Author Console';
  res.render('console', { 
  	title: t,
  	login: false,
  	console: true
  });
});

app.get('/home', function (req, res) {
  var t = 'Home';
  res.render('home', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/profile', function (req, res) {
  var t = 'Profile';
  res.render('profile', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/notifications', function (req, res) {
  var t = 'Notifications';
  res.render('notifications', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/new', function (req, res) {
  var t = 'New Article';
  res.render('new', { 
  	title: t,
  	login: true,
  	console: true
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});