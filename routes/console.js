'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var bcrypt = require('bcrypt');

var authorMovies = function (req, call) {
  var getInfo = function (item, callback) {
    item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");
    item.url = '/article/' + item.articleId + '/draft';
    callback(null, item);
  };

  var queryString = 'SELECT articles.author, editors.name AS assignedEditor, authors.name AS authorname,' +
    'articles.url, articles.articleId, articles.isPublished, articles.updateDate,' +
    'articles.title, articles.image, editors.username AS editorUsername FROM articles ' +
    'INNER JOIN authors AS authors ON authors.username = articles.author ' +
    'INNER JOIN authors AS editors ON authors.assignedEditor = editors.username ' +
    'WHERE articles.isPublished != 2';

  if (req.session.isEditor === 0) {
    queryString = queryString + ' AND articles.author=\'' + req.session.username + '\'';
  } else if (req.session.isEditor === 1) {
    queryString = queryString + ' AND (articles.author=\'' + req.session.username + '\' OR ' +
      'authors.assignedEditor =\'' + req.session.username + '\')';
  }

  queryString = queryString + ' ORDER BY articles.updateDate DESC, articles.articleId DESC';

  async.waterfall([
    function (callback) {
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.map(rows, getInfo, callback);
    }
  ], function (err, result) {
    call(err, result);
  });
};

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  res.locals.inConsole = true;
  next();
};

router.get('/', function (req, res) {
  if (req.session.login) {
    return res.redirect('/console/home');
  }

  res.render('console', {
    title: 'Author Console'
  });
});

router.get('/signup', function (req, res) {
  if (req.session.login) {
    return res.redirect('/console/home');
  }

  res.render('signup', {
    title: 'Become an author!'
  });
});

router.post('/login', function (req, res) {
  var user = req.body.username;
  var password = req.body.password;

  var query = 'SELECT username, password, name, isEditor FROM authors WHERE username=?';

  connection.query(query, [user], function (err, rows) {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      res.send({success: false, msg: 'Username not found!'});
    } else if (rows[0].isEditor === -1) {
      res.send({
        success: false,
        msg: 'Your account has not been approved yet!'
      });
    } else {
      bcrypt.compare(password, rows[0].password, function (err, correct) {
        if (correct) {
          req.session.login = true;
          req.session.username = user;
          req.session.name = rows[0].name;
          req.session.isEditor = rows[0].isEditor;
          res.send({success: true, msg: 'Welcome!'});
        } else {
          res.send({success: false, msg: 'Incorrect password!'});
        }
      });
    }
  });
});

router.get('/logout', function (req, res) {
  req.session.login = false;
  req.session.username = undefined;
  req.session.name = undefined;
  req.session.isEditor = -1;
  res.redirect('/');
});

router.get('/home', authenticate, function (req, res) {
  async.parallel([
    function (callback) {
      authorMovies(req, callback);
    }, function (callback) {
      if (req.session.isEditor === 2) {
        var query = 'SELECT authors.name, authors.username, authors.isEditor,' +
          'editors.name AS assignedEditor FROM authors ' +
          'INNER JOIN authors AS editors ON authors.assignedEditor = editors.username';
        connection.query(query, callback);
      } else {
        callback();
      }
    }, function (callback) {
      if (req.session.isEditor === 2) {
        var query = 'SELECT authors.name, authors.username, authors.isEditor FROM authors ' +
          'INNER JOIN authors AS editors ON authors.assignedEditor = editors.username ' +
          'WHERE authors.isEditor > 0';
        connection.query(query, callback);
      } else {
        callback();
      }
    }
  ], function (err, results) {
    if (err) {
      console.log(err);
    }
    var authors = req.session.isEditor === 2 ? results[1][0] : null;
    var editors = req.session.isEditor === 2 ? results[2][0] : null;
    var returnData = {
      title: 'Home',
      articleList: results[0],
      authors: authors,
      editors: editors
    };
    res.render('home', returnData);
  });
});

module.exports = router;