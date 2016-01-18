'use strict';

var express = require('express');
var router = express.Router();
var connection = require('../databases/sql');

router.post('/', function (req, res) {
  var search = ['%' + req.body.q + '%'];
  var queryString = 'SELECT url, title FROM articles WHERE title LIKE ? ORDER BY pubDate DESC';
  connection.query(queryString, search, function (err, rows) {
    res.send(rows);
  });
});

module.exports = router;