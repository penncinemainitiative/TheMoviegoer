'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');
var connection = require('../databases/sql');
var ddb = require('../databases/ddb');
var uploadToS3 = require('../databases/uploadS3');
var analytics = require('../databases/analytics');

router.get('/', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  var insertData = {
    isPublished: 0,
    updateDate: new Date(),
    type: 'feature',
    title: 'Untitled Article',
    author: req.session.username,
    url: '/',
    image: 'https://www.royalacademy.org.uk/' +
    'assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg'
  };

  var newId, url;

  async.waterfall([
    function (callback) {
      var queryString = 'INSERT INTO articles SET ?';
      connection.query(queryString, insertData, callback);
    }, function (result, fields, callback) {
      newId = result.insertId;
      url = '/article/' + newId;
      var queryString = 'UPDATE articles SET url=\'' + url +
        '\' WHERE articleId=' + newId;
      connection.query(queryString, callback);
    }, function (result, fields, callback) {
      var value = {
        text: '',
        imgList: [],
        captionList: [],
        caption: -1
      };
      var newItem = {
        articleId: newId,
        value: JSON.stringify(value)
      };
      ddb.putItem('articles', newItem, {}, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect(url);
  });
});

router.get('/:id', function (req, res) {
  var articleId = parseInt(req.params.id);

  var returnData = {
    login: req.session.login,
    console: false
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT isPublished, pubDate, type, title, author ' +
        'FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (rows[0].isPublished === 0 || rows[0].isPublished === 1) {
        return res.redirect('/article/' + req.params.id + '/draft');
      }
      returnData.title = rows[0].title;
      returnData.date = dateFormat(rows[0].pubDate, "mmmm d, yyyy");
      returnData.type = rows[0].type;
      var queryString = 'SELECT name FROM authors WHERE username=\'' +
        rows[0].author + '\'';
      connection.query(queryString, callback);
    }, function(rows, fields, callback) {
      returnData.author = rows[0].name;
      ddb.getItem('articles', articleId, null, {}, callback);
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    }
    var value = JSON.parse(result.value);
    returnData.text = value.text;
    res.render('article', returnData);
  });
});

router.post('/:id', function (req, res) {
  var articleId = parseInt(req.params.id);
  var title = req.body.title;
  var type = req.body.type;
  var text = req.body.text;

  async.waterfall([
    function (callback) {
      var queryString = 'UPDATE articles SET updateDate=NOW(), title=' + connection.escape(title) +
        ',type=' + connection.escape(type) + ' WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function(rows, fields, callback) {
      ddb.getItem('articles', articleId, null, {}, callback);
    }, function(result, cap, callback) {
      var value = JSON.parse(result.value);
      value.text = text;
      var newItem = {
        'value': {value: JSON.stringify(value)}
      };
      ddb.updateItem('articles', articleId, null, newItem, {}, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.get('/:id/draft', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  var articleId = parseInt(req.params.id);

  var returnData = {
    login: req.session.login,
    console: true,
    articleId: articleId,
    isEditor: req.session.isEditor
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT isPublished, pubDate, type, title, author ' +
        'FROM articles WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      if (rows[0].isPublished === 2) {
        return res.redirect('/article/' + req.params.id);
      }
      returnData.title = rows[0].title;
      returnData.date = dateFormat(rows[0].updateDate, "mmmm d, yyyy");
      returnData.isPublished = rows[0].isPublished;
      returnData.type = rows[0].type;
      var queryString = 'SELECT name FROM authors WHERE username=\'' +
        rows[0].author + '\'';
      connection.query(queryString, callback);
    }, function(rows, fields, callback) {
      returnData.author = rows[0].name;
      ddb.getItem('articles', articleId, null, {}, callback);
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    }
    var value = JSON.parse(result.value);
    returnData.text = value.text;
    returnData.imgList = value.imgList;
    returnData.captionList = value.captionList;
    returnData.cover = value.cover;
    res.render('draft', returnData);
  });
});

router.get('/:id/delete', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

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
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/console/home');
  });
});

router.post('/:id/cover', function (req, res) {
  var articleId = parseInt(req.params.id);
  var image = req.body.image;
  var imageIndex = parseInt(req.body.imageIndex);

  async.waterfall([
    function (callback) {
      var queryString = 'UPDATE articles SET updateDate=NOW(), image=' + connection.escape(image) +
        ' WHERE articleId=' + articleId;
      connection.query(queryString, callback);
    }, function(rows, fields, callback) {
      ddb.getItem('articles', articleId, null, {}, callback);
    }, function(result, cap, callback) {
      var value = JSON.parse(result.value);
      value.cover = imageIndex;
      var newItem = {
        'value': {value: JSON.stringify(value)}
      };
      ddb.updateItem('articles', articleId, null, newItem, {}, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

router.post('/:id/captions', function (req, res) {
  req.session.caption = req.body.caption;
  res.send({success: true});
});

router.post('/:id/photos', function (req, res) {
  var flag = false;
  var articleId = parseInt(req.params.id);
  uploadToS3(req.file, function (image_url) {
    var caption = req.session.caption;

    async.waterfall([
      function (callback) {
        ddb.getItem('articles', articleId, null, {}, callback);
      }, function(result, cap, callback) {
        var value = JSON.parse(result.value);
        value.imgList.push(image_url);
        value.captionList.push(caption);
        if (value.caption === -1) {
          value.caption = 0;
          flag = true;
        }
        var newItem = {
          'value': {value: JSON.stringify(value)}
        };
        ddb.updateItem('articles', articleId, null, newItem, {}, callback);
      }, function(result, cap, callback) {
        if (!flag) {
          return res.redirect('/article/' + articleId);
        }
        var queryString = 'UPDATE articles SET updateDate=NOW(), ' +
          'image=\'' + image_url + '\'' +
          ' WHERE articleId=' + articleId;
        connection.query(queryString, callback);
      }
    ], function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/article/' + articleId);
    });
  });
});

router.post('/:id/submit', function (req, res) {
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

router.post('/:id/publish', function (req, res) {
  var articleId = parseInt(req.params.id);

  if (req.session.isEditor !== 1) {
    return res.send({success: false, msg: 'Only an editor can publish articles!'});
  }

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