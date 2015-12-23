'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var connection = require('../databases/sql');
var ddb = require('../databases/ddb');
var uploadToS3 = require('../databases/uploadS3');

router.use(function authenticate(req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  next();
});

router.get('/profile', function (req, res) {
  var returnData = {
    title: 'Profile',
    login: true,
    console: true
  };

  var query = 'SELECT username, email, name, bio, image FROM authors ' +
    'WHERE username=\'' + req.session.username + '\'';

  connection.query(query, function (err, rows) {
    if (err) {
      throw err;
    }

    var userInfo = rows[0];
    returnData.email = userInfo.email;
    returnData.name = userInfo.name;
    returnData.bio = userInfo.bio;
    returnData.image = userInfo.image;

    res.render('profile', returnData);
  });
});

router.post('/profile/description', function (req, res) {
  var name = req.body.name;
  var bio = req.body.bio;

  var query = 'UPDATE authors SET ' +
    'name=' + connection.escape(name) + ', ' +
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

router.post('/profile/picture', function (req, res) {
  uploadToS3(req.file, function (image_url) {
    var query = 'UPDATE authors SET image=\'' + image_url + '\' WHERE '
      + 'username=\'' + req.session.username + '\'';

    connection.query(query, function (err) {
      if (err) {
        res.send({success: false});
      } else {
        res.redirect('/profile');
      }
    });
  });
});

router.post('/password', function (req, res) {
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

router.post('/approve', function (req, res) {
  var username = req.body.username;

  var queryString = 'UPDATE authors SET isEditor=0 WHERE username=' +
    connection.escape(username);

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

module.exports = router;