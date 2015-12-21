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
var dateFormat = require('dateformat');
var secretObj = JSON.parse(fs.readFileSync('json/secret.json', 'utf8'));

var connection = require('./databases/sql');
var ddb = require('./databases/ddb');

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

app.use('/console', require('./routes/console'));
app.use('/account', require('./routes/account'));
app.use('/article', require('./routes/article'));

app.get('/', function (req, res) {
  var newRows = [];

  var getInfo = function (item, callback) {
    item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");

    var queryString = 'SELECT name FROM authors WHERE username='
      + connection.escape(item.author);
    connection.query(queryString, function (err, rows) {
      item.authorname = rows[0].name;
      newRows.push(item);
      callback();
    });
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT articleId, isPublished, url, pubDate, title, ' +
        'author, image FROM articles WHERE isPublished=2 ORDER BY pubDate ' +
        'DESC, articleId DESC';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    var returnData = {
      title: 'The Moviegoer',
      login: req.session.login,
      console: false,
      articleList: newRows
    };
    res.render('index', returnData);
  });
});

app.get('/events', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  res.render('events', {
    title: 'Events',
    login: true,
    console: true
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
