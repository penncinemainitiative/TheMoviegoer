'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  res.render('events', {
    title: 'Events',
    login: true,
    console: true
  });
});

module.exports = router;