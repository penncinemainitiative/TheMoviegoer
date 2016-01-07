'use strict';

var express = require('express');
var router = express.Router();
var connection = require('../databases/sql');

router.post('/', function (req, res) {
  var search = req.body.q;
  var queryString = 'SELECT articleId, title FROM articles ' +
    'WHERE title LIKE ' + connection.escape('%'+search+'%');
  connection.query(queryString, function(err, rows) {
    res.send(rows);
  });
});

module.exports = router;