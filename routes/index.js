'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');

var movieList = function (movieType, call) {
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

  var queryString = 'SELECT articleId, isPublished, url, pubDate, title, ' +
    'author, image FROM articles WHERE isPublished=2 AND (' + movieType +
    ') ORDER BY pubDate DESC, articleId DESC';

  async.waterfall([
    function (callback) {
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function () {
    call(null, newRows);
  });
};

router.get('/', function (req, res) {
  async.parallel([
    function (callback) {
      var movieType = "type=\'newmovie\' OR type=\'oldmovie\'";
      movieList(movieType, callback);
    }, function (callback) {
      var movieType = "type=\'feature\'";
      movieList(movieType, callback);
    }, function (callback) {
      var queryString = 'SELECT image FROM events';
      connection.query(queryString, callback);
    }], function (err, results) {
    var events = results[2][0];
    var returnData = {
      title: 'The Moviegoer',
      movies: results[0],
      features: results[1],
      nextEvent: events[0]
    };
    res.render('index', returnData);
  });
});

router.get('/about', function (req, res) {
  res.render('about', {
    title: 'About'
  });
});

router.get('/features', function (req, res) {
  async.waterfall([
    function (callback) {
      var movieType = "type=\'feature\'";
      movieList(movieType, callback);
    }
  ], function (err, results) {
    var returnData = {
      title: 'Features',
      features: results
    };
    res.render('features', returnData);
  });
});

router.get('/movies', function (req, res) {
  async.parallel([
    function (callback) {
      var movieType = "type=\'newmovie\'";
      movieList(movieType, callback);
    }, function (callback) {
      var movieType = "type=\'oldmovie\'";
      movieList(movieType, callback);
    }], function (err, results) {
    var returnData = {
      title: 'Movies',
      newReleases: results[0],
      oldReleases: results[1]
    };
    res.render('movies', returnData);
  });
});

module.exports = router;