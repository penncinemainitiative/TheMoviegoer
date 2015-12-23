'use strict';

var express = require('express');
var router = express.Router();

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  next();
};

router.get('/', authenticate, function (req, res) {
  res.render('events', {
    title: 'Events',
    login: true,
    console: true
  });
});

module.exports = router;