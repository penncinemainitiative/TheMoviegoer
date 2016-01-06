'use strict';

var express = require('express');
var router = express.Router();
var uploadToS3 = require('../databases/uploadS3');
var connection = require('../databases/sql');

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  next();
};

router.get('/', function (req, res) {
  res.locals.inConsole = req.session.login;
  var queryString = 'SELECT image, date FROM events ORDER BY date DESC';
  connection.query(queryString, function(err, rows) {
    res.render('events', {
      title: 'Events',
      events: rows
    });
  });
});

router.post('/create', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.redirect('/');
  }
  res.locals.inConsole = true;
  uploadToS3(req.file, 'events', function (image_url) {
    var insertData = {
      image: image_url,
      date: new Date()
    };
    var queryString = 'INSERT INTO events SET ?';
    connection.query(queryString, insertData, function(err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/events');
    });
  });
});

router.post('/:eventId', authenticate, function (req, res) {
  res.locals.inConsole = req.session.login;
  res.render('events', {
    title: 'Events'
  });
});

router.get('/:eventId', function (req, res) {
  res.locals.inConsole = req.session.login;
  res.render('events', {
    title: 'Events'
  });
});

module.exports = router;