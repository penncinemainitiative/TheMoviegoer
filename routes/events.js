'use strict';

var express = require('express');
var router = express.Router();
var uploadToS3 = require('../databases/uploadS3');
var connection = require('../databases/sql');

var authenticate = function (req, res, next) {
  if (req.session.isEditor !== 1) {
    return res.redirect('/console');
  }
  res.locals.inConsole = req.session.login;
  next();
};

router.get('/', function (req, res) {
  var queryString = 'SELECT eventId, image, date, fbLink FROM events ORDER BY date DESC';
  connection.query(queryString, function (err, rows) {
    res.render('events', {
      title: 'Events',
      events: rows
    });
  });
});

router.post('/create', authenticate, function (req, res) {
  uploadToS3(req.file, 'events', function (image_url) {
    req.body.image = image_url;
    var queryString = 'INSERT INTO events SET ?';
    connection.query(queryString, req.body, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/events');
    });
  });
});

router.post('/:eventId', authenticate, function (req, res) {
  var eventId = parseInt(req.params.eventId);
  var data = req.body;
  var editEvent = function(image_url) {
    var queryString = 'UPDATE events SET date=' + connection.escape(data.date) +
      ', description=' + connection.escape(data.description) +
      ', location=' + connection.escape(data.location) +
      ', fbLink=' + connection.escape(data.fbLink) +
      ', film=' + connection.escape(data.film) +
      ', time=' + connection.escape(data.time) +
      ', title=' + connection.escape(data.title);
    if (image_url) {
      queryString += ', image=' + image_url;
    }
    queryString += ' WHERE eventId=' + eventId;
    connection.query(queryString, req.body, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/events');
    });
  };
  if (req.file) {
    uploadToS3(req.file, 'events', editEvent);
  } else {
    editEvent();
  }
});

router.get('/:eventId', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.redirect('/console/home');
  }
  var eventId = parseInt(req.params.eventId);
  var queryString = 'SELECT eventId, date, description, location, image, ' +
    'fbLink, time, title, film FROM events WHERE eventId=' + eventId;
  connection.query(queryString, function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(rows[0]);
  });
});

router.get('/delete/:eventId', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.redirect('/console/home');
  }
  var eventId = parseInt(req.params.eventId);
  var queryString = 'DELETE FROM events WHERE eventId=' + eventId;
  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/events');
  });
});

module.exports = router;