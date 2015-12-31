'use strict';

var express = require('express');
var router = express.Router();

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  next();
};

router.get('/', function (req, res) {
  res.locals.inConsole = req.session.login;
  res.render('events', {
    title: 'Events'
  });
});

module.exports = router;