'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var ddb = require('../databases/ddb');

router.get('/', function (req, res) {
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

router.get('/about', function (req, res) {
  res.render('about', {
    title: 'About',
    login: false
  });
});

router.get('/features', function (req, res) {
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
      var queryString = 'SELECT url, pubDate, title, author, image FROM ' +
        'articles WHERE isPublished=2 AND type=\'feature\' ' +
        'ORDER BY pubDate DESC, articleId DESC';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    var returnData = {
      title: 'Features',
      login: req.session.login,
      console: false,
      features: newRows
    };
    res.render('features', returnData);
  });
});

router.get('/movies', function (req, res) {
  var movieList = function (queryString, call) {
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
        connection.query(queryString, callback);
      }, function (rows, fields, callback) {
        async.eachSeries(rows, getInfo, callback);
      }
    ], function () {
      call(null, newRows);
    });
  };

  async.parallel([
    function (callback) {
      var queryString = 'SELECT url, pubDate, title, author, image FROM ' +
        'articles WHERE isPublished=2 AND type=\'newmovie\' ' +
        'ORDER BY pubDate DESC, articleId DESC';
      movieList(queryString, callback);
    }, function (callback) {
      var queryString = 'SELECT url, pubDate, title, author, image FROM ' +
        'articles WHERE isPublished=2 AND type=\'oldmovie\' ' +
        'ORDER BY pubDate DESC, articleId DESC';
      movieList(queryString, callback);
    }], function (err, results) {
    var returnData = {
      title: 'Movies',
      login: req.session.login,
      console: false,
      newReleases: results[0],
      oldReleases: results[1]
    };
    res.render('movies', returnData);
  });
});

module.exports = router;