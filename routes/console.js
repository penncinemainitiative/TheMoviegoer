'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var ddb = require('../databases/ddb');

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  next();
};

router.get('/', function (req, res) {
  if (req.session.login) {
    return res.redirect('/console/home');
  }

  res.render('console', {
    title: 'Author Console',
    login: false,
    console: true
  });
});

router.post('/login', function (req, res) {
  var user = req.body.username;
  var pw = req.body.password;

  var query = 'SELECT username, password, name, isEditor FROM authors ' +
    'WHERE username=' + connection.escape(user);

  connection.query(query, function (err, rows) {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      res.send({success: false, msg: 'Username not found!'});
    } else if (rows[0].password !== pw) {
      res.send({success: false, msg: 'Incorrect password!'});
    } else if (rows[0].isEditor === -1) {
      res.send({
        success: false,
        msg: 'Your account has not been approved yet!'
      });
    } else {
      req.session.login = true;
      req.session.username = user;
      req.session.name = rows[0].name;
      req.session.isEditor = rows[0].isEditor;
      res.send({success: true, msg: 'Welcome!'});
    }
  });
});

router.post('/logout', function (req, res) {
  req.session.login = false;
  req.session.username = undefined;
  res.send({success: true, msg: 'Bye!'});
});

router.get('/home', authenticate, function (req, res) {
  var newRows = [];

  var getInfo = function (item, callback) {
    item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");

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
      var queryString = 'SELECT articleId, isPublished, url, updateDate, ' +
        'title, author, image FROM articles WHERE isPublished!=2';

      if (req.session.isEditor === 0) {
        queryString = queryString + ' AND author=\'' + req.session.username + '\'';
      } else if (req.session.isEditor === 1) {
        queryString = queryString + ' AND (author=\'' + req.session.username + '\'' +
          'OR isPublished=1)';
      }

      queryString = queryString + ' ORDER BY updateDate DESC, articleId DESC';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    var returnData = {
      title: 'Home',
      login: req.session.login,
      name: req.session.name,
      console: true,
      articleList: newRows
    };
    res.render('home', returnData);
  });
});

module.exports = router;