'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var uploadToS3 = require('../databases/uploadS3');

var authorMovies = function (username, call) {
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
    'author, image FROM articles WHERE isPublished=2 AND author=\'' +
    username + '\' ORDER BY pubDate DESC, articleId DESC';

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

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  res.locals.inConsole = true;
  next();
};

var profile = function (req, res, query) {
  var returnData = {
    inConsole: res.locals.inConsole
  };

  async.waterfall([
    function (callback) {
      connection.query(query, callback);
    }, function (rows, fields, callback) {
      var username = rows[0].username;
      returnData.title = rows[0].name;
      returnData.email = rows[0].email;
      returnData.name = rows[0].name;
      returnData.bio = rows[0].bio;
      returnData.image = rows[0].image;
      authorMovies(username, callback);
    }], function (err, results) {
    returnData.moviesList = results;
    res.render('profile', returnData);
  });
};

router.get('/profile', authenticate, function (req, res) {
  var query = 'SELECT username, email, name, bio, image FROM authors ' +
    'WHERE username=\'' + req.session.username + '\'';
  profile(req, res, query);
});

router.get('/profile/:author', function (req, res) {
  var query = 'SELECT username, email, name, bio, image FROM authors WHERE ' +
    'REPLACE(name, " ", "") = REPLACE(' +
    connection.escape(req.params.author) + ', " ", "")';
  profile(req, res, query);
});

router.post('/profile/description', authenticate, function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var bio = req.body.bio;

  var query = 'UPDATE authors SET ' +
    'name=' + connection.escape(name) + ', ' +
    'email=' + connection.escape(email) + ', ' +
    'bio=' + connection.escape(bio) + ' WHERE ' +
    'username=' + connection.escape(req.session.username);

  connection.query(query, function (err) {
    if (err) {
      console.log('Profile Edit Error');
      console.log(err);
      res.send({success: false});
    } else {
      res.send({success: true});
    }
  });
});

router.post('/profile/picture', authenticate, function (req, res) {
  uploadToS3(req.file, function (image_url) {
    var query = 'UPDATE authors SET image=\'' + image_url + '\' WHERE '
      + 'username=\'' + req.session.username + '\'';

    connection.query(query, function (err) {
      if (err) {
        res.send({success: false});
      } else {
        res.redirect('/author/profile');
      }
    });
  });
});

router.post('/password', authenticate, function (req, res) {
  var oldPassword = req.body.oldpassword;
  var newPassword = req.body.newpassword;

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT password FROM authors WHERE username=' +
        connection.escape(req.session.username);
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (oldPassword !== rows[0].password) {
        return res.send({success: false, msg: "Passwords do not match!"});
      }
      var queryString = 'UPDATE authors SET password=' + connection.escape(newPassword) +
        ' WHERE username=' + connection.escape(req.session.username);
      connection.query(queryString, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.send({
      success: true,
      msg: "Password has been successfully changed!"
    });
  });
});

router.post('/create', function (req, res) {
  if (req.session.login) {
    return res.redirect('/console');
  }

  var username = req.body.username;
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;
  var isEditor = -1;
  var image = 'https://www.royalacademy.org.uk/assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg';
  var bio = '...';

  var queryString = 'INSERT INTO authors (username,email,name,password,isEditor,image,bio) VALUES (' +
    connection.escape(username) + ',' +
    connection.escape(email) + ',' +
    connection.escape(name) + ',' +
    connection.escape(password) + ',' +
    isEditor + ',' +
    connection.escape(image) + ',' +
    connection.escape(bio) + ')';

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
      res.send({success: false, msg: err});
    } else {
      res.send({
        success: true,
        msg: 'Account has been created and is awaiting approval!'
      });
    }
  });
});

router.get('/approve/:username', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.redirect('/console/home');
  }
  var queryString = 'UPDATE authors SET isEditor=0 WHERE username=' +
    connection.escape(req.params.username);

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/console/home');
  });
});

module.exports = router;