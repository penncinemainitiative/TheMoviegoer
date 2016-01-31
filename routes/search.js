'use strict';

var express = require('express');
var router = express.Router();
var connection = require('../databases/sql');

router.post('/', function (req, res) {
  var search = ['%' + req.body.q + '%'];
  var queryString = 'SELECT url, title FROM articles WHERE title LIKE ? ORDER BY pubDate DESC';
  connection.query(queryString, search, function (err, articles) {
    connection.query('SELECT name FROM authors WHERE name LIKE ?', search, function (err, authors) {
      res.send(articles.concat(authors));
    });
  });
});

router.post('/authors', function (req, res) {
  var search = ['%' + req.body.q + '%'];
  connection.query('SELECT username, name FROM authors WHERE name LIKE ?', search, function (err, authors) {
    res.send(authors);
  });
});

router.post('/editors', function (req, res) {
  var search = ['%' + req.body.q + '%'];
  connection.query('SELECT username, name FROM authors WHERE name LIKE ? AND isEditor > 0', search, function (err, authors) {
    res.send(authors);
  });
});

module.exports = router;