'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var getPopularMovies = require('../databases/analytics');

var movieList = function (movieType, call) {
  var newRows = [];

  var getInfo = function (item, callback) {
    item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
    item.url = '/article/' + item.articleId;

    var queryString = 'SELECT name FROM authors WHERE username='
      + connection.escape(item.author);
    connection.query(queryString, function (err, rows) {
      item.authorname = rows[0].name;
      newRows.push(item);
      callback();
    });
  };

  var queryString = 'SELECT articleId, isPublished, pubDate, title, ' +
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
    }, function (callback) {
      getPopularMovies(callback);
    }], function (err, results) {
    var events = results[2][0];
    var returnData = {
      title: 'The Moviegoer',
      movies: results[0],
      features: results[1],
      nextEvent: events[0],
      popularMovies: results[3]
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
  res.redirect('/features/1');
});

router.get('/features/:page', function(req, res) {
  var page = parseInt(req.params.page);
  var perPage = 4;
  async.waterfall([
    function (callback) {
      var movieType = "type=\'feature\'";
      movieList(movieType, callback);
    }
  ], function (err, results) {
    var features = results;
    var totalPages = Math.ceil(features.length / perPage);
    if (page >= totalPages) {
      res.redirect('/features');
    }
    var startSlice = (page - 1) * perPage;
    var returnData = {
      title: 'Features',
      features: features.slice(startSlice, startSlice + perPage),
      page: page,
      totalPages: totalPages,
      baseUrl: '/features/'
    };
    res.render('features', returnData);
  });
});

router.get('/movies', function (req, res) {
  res.redirect('/movies/1');
});

router.get('/movies/:page', function (req, res) {
  var page = parseInt(req.params.page);
  var perPage = 4;
  async.parallel([
    function (callback) {
      var movieType = "type=\'newmovie\'";
      movieList(movieType, callback);
    }, function (callback) {
      var movieType = "type=\'oldmovie\'";
      movieList(movieType, callback);
    }], function (err, results) {
    var newReleases = results[0];
    var oldReleases = results[1];
    var newPages = Math.ceil(newReleases.length / perPage);
    var oldPages = Math.ceil(oldReleases.length / perPage);
    var totalPages = Math.max(newPages, oldPages);
    if (page <= 0 || page >= totalPages) {
      res.redirect('/movies');
    }
    var startSlice = (page - 1) * perPage;

    var returnData = {
      title: 'Movies',
      newReleases: newReleases.slice(startSlice, startSlice + perPage),
      oldReleases: oldReleases.slice(startSlice, startSlice + perPage),
      page: page,
      totalPages: totalPages,
      baseUrl: '/movies/'
    };
    res.render('movies', returnData);
  });
});

module.exports = router;