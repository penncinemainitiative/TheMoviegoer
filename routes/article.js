'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var uploadToS3 = require('../databases/uploadS3');
var getPopularMovies = require('../databases/analytics');

var authenticate = function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/console');
  }
  res.locals.inConsole = true;
  next();
};

router.get('/', authenticate, function (req, res) {
  var insertData = {
    isPublished: 0,
    updateDate: new Date(),
    type: 'feature',
    title: 'Untitled Article',
    author: req.session.username,
    text: '...',
    image: 'https://www.royalacademy.org.uk/' +
    'assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg'
  };

  var queryString = 'INSERT INTO articles SET ?';
  connection.query(queryString, insertData, function (err, result) {
    if (err) {
      console.log(err);
    }
    var newId = result.insertId;
    var url = '/article/' + newId;
    res.redirect(url);
  });
});

router.get('/:id', function (req, res) {
  var articleId = parseInt(req.params.id);

  var returnData = {
    articleId: articleId
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT excerpt, text, image, isPublished, pubDate, type, title, author ' +
        'FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (rows[0].isPublished === 0 || rows[0].isPublished === 1) {
        return res.redirect('/article/' + req.params.id + '/draft');
      }
      returnData.excerpt = rows[0].excerpt;
      returnData.image = rows[0].image;
      returnData.title = rows[0].title;
      returnData.date = dateFormat(rows[0].pubDate, "mmmm d, yyyy");
      returnData.type = rows[0].type;
      returnData.text = rows[0].text;
      var queryString = 'SELECT name FROM authors WHERE username=\'' +
        rows[0].author + '\'';
      connection.query(queryString, callback);
    }
  ], function (err, rows) {
    if (err) {
      console.log(err);
    }
    returnData.author = rows[0].name;
    getPopularMovies(function (err, popular) {
      returnData.popularMovies = popular;
      res.render('article', returnData);
    });
  });
});

router.post('/:id', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);
  var title = req.body.title;
  var type = req.body.type;
  var text = req.body.text;
  var excerpt = req.body.excerpt;

  var queryString = 'UPDATE articles SET updateDate=NOW(), title=' + connection.escape(title) +
    ',type=' + connection.escape(type) + ',text=' + connection.escape(text) + ',excerpt=' + connection.escape(excerpt) + ' WHERE articleId=' + articleId;

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.get('/:id/draft', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);

  var returnData = {
    articleId: articleId
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT excerpt, text, image, isPublished, pubDate, type, title, author ' +
        'FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (rows[0].isPublished === 2 && req.session.isEditor !== 1) {
        return res.redirect('/article/' + req.params.id);
      }
      returnData.excerpt = rows[0].excerpt;
      returnData.image = rows[0].image;
      returnData.title = rows[0].title;
      returnData.date = dateFormat(rows[0].updateDate, "mmmm d, yyyy");
      returnData.isPublished = rows[0].isPublished;
      returnData.type = rows[0].type;
      returnData.text = rows[0].text;
      var queryString = 'SELECT name FROM authors WHERE username=\'' +
        rows[0].author + '\'';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      returnData.author = rows[0].name;
      var queryString = 'SELECT image FROM images WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    }
    returnData.imgList = result;
    res.render('draft', returnData);
  });
});

router.get('/:id/delete', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT author FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (rows[0].author !== req.session.username && req.session.isEditor !== 1) {
        res.redirect('/home');
        return;
      }
      var queryString = 'DELETE FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      var queryString = 'DELETE FROM images WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/console/home');
  });
});

router.post('/:id/cover', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);
  var image = req.body.image;

  var queryString = 'UPDATE articles SET updateDate=NOW(), image=' + connection.escape(image) +
    ' WHERE articleId=' + articleId;
  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.post('/:id/photos', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);
  uploadToS3(req.file, articleId, function (image_url) {
    async.parallel([
      function (callback) {
        var queryString = 'UPDATE articles SET updateDate=NOW(), ' +
          'image=\'' + image_url + '\' WHERE articleId=' + articleId;
        connection.query(queryString, callback);
      }, function (callback) {
        var insertData = {
          articleId: articleId,
          image: image_url
        };
        var queryString = 'INSERT INTO images SET ?';
        connection.query(queryString, insertData, callback);
      }
    ], function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/article/' + articleId);
    });
  });
});

router.post('/:id/submit', authenticate, function (req, res) {
  var articleId = parseInt(req.params.id);

  var queryString = 'UPDATE articles SET updateDate=NOW(), ' +
    'isPublished=1 WHERE articleId=' + articleId;

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.post('/:id/retract', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.send({
      success: false,
      msg: 'Only an editor can retract articles!'
    });
  }

  var articleId = parseInt(req.params.id);

  var queryString = 'UPDATE articles SET updateDate=NOW(), ' +
    'isPublished=0 WHERE articleId=' + articleId;

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.post('/:id/publish', authenticate, function (req, res) {
  if (req.session.isEditor !== 1) {
    return res.send({
      success: false,
      msg: 'Only an editor can publish articles!'
    });
  }

  var articleId = parseInt(req.params.id);

  var queryString = 'UPDATE articles SET pubDate=NOW(), updateDate=NOW(), ' +
    'isPublished=2 WHERE articleId=' + articleId;

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

module.exports = router;