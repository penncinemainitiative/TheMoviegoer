var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var secretObj = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
var mysqlObj = JSON.parse(fs.readFileSync('mysqldb.json', 'utf8'));
app.engine('ejs', engine);
app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'ejs');

app.use( express.static( path.join( __dirname, 'public' )));
app.use(express.static(__dirname + '/views/stylesheets'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/views/js'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: secretObj.secret,
	resave: true,
  saveUninitialized: true,
  login: false
}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : mysqlObj.host,
  user     : mysqlObj.user,
  password : mysqlObj.password,
  port     : mysqlObj.port,
  database : mysqlObj.database
});

app.get('/', function (req, res) {
  var t = 'The Moviegoer';
  res.render('index', { 
  	title: t,
  	login: false,
  	console: false
  });
});

app.get('/console', function (req, res) {
	if(req.session.login) {
		res.redirect('/home');
		return;
	}

  var t = 'Author Console';
  res.render('console', { 
  	title: t,
  	login: false,
  	console: true
  });
});

app.post('/login', function (req, res) {
	var user = req.body.username;
	var pw = req.body.password;

	var query = 'SELECT username, password FROM authors WHERE username=\'' + user + '\'';

	connection.query(query, function(err, rows, fields) {
	  if (err) {
	  	throw err;
	  }

	 	if (rows.length === 0) {
	 		res.send({success: false, msg: 'Username not found!'});
	 	} else if (rows[0].password !== pw) {
	 		res.send({success: false, msg: 'Incorrect password!'});
		} else {
			req.session.login = true;
			req.session.username = user;
			res.send({success: true, msg: 'Welcome!'});
		}
	});
 
});

app.post('/logout', function (req, res) {
	req.session.login = false;
	req.session.username = undefined;
	res.send({success: true, msg: 'Bye!'});
});

app.get('/home', function (req, res) {
	if(!req.session.login) {
		res.redirect('/console');
		return;
	}

  var t = 'Home';
  res.render('home', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/profile', function (req, res) {
  if(!req.session.login) {
		res.redirect('/console');
		return;
	}

  var t = 'Profile';
  res.render('profile', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/events', function (req, res) {
  if(!req.session.login) {
		res.redirect('/console');
		return;
	}

  var t = 'Events';
  res.render('events', { 
  	title: t,
  	login: true,
  	console: true
  });
});

app.get('/new', function (req, res) {
  if(!req.session.login) {
		res.redirect('/console');
		return;
	}

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

  console.log('Example app listening at http://localhost:%s', port);
});