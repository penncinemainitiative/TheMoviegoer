'use strict';

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var session = require('express-session');
var multer = require('multer');
var s3 = require('multer-s3');
var bodyParser = require('body-parser');
var fs = require('fs');
var async = require('async');
var secretObj = JSON.parse(fs.readFileSync('json/secret.json', 'utf8'));
var mysqlObj = JSON.parse(fs.readFileSync('json/mysqldb.json', 'utf8'));
var awsObj = JSON.parse(fs.readFileSync('json/aws.json', 'utf8'));
var dateFormat = require('dateformat');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({dest: './uploads/', includeEmptyFields: true}).single('photo'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views/stylesheets'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/views/js'));
app.use(express.static(__dirname + '/views/fonts'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: secretObj.secret,
  resave: true,
  saveUninitialized: true,
  login: false
}));

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: mysqlObj.host,
  user: mysqlObj.user,
  password: mysqlObj.password,
  port: mysqlObj.port,
  database: mysqlObj.database
});

var ddb = require('dynamodb').ddb({
  accessKeyId: awsObj.accessKeyId,
  secretAccessKey: awsObj.secretAccessKey,
  region: "us-east-1"
});

app.get('/', function (req, res) {
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

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT articleId, isPublished, url, pubDate, title, ' +
        'author, image FROM articles WHERE isPublished=2 ORDER BY pubDate ' +
        'DESC, articleId DESC';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    var returnData = {
      title: 'The Moviegoer',
      login: req.session.login,
      console: false,
      articleList: newRows
    };
    res.render('index', returnData);
  });
});

app.get('/console', function (req, res) {
  if (req.session.login) {
    res.redirect('/home');
    return;
  }

  res.render('console', {
    title: 'Author Console',
    login: false,
    console: true
  });
});

app.post('/login', function (req, res) {
  var user = req.body.username;
  var pw = req.body.password;

  var query = 'SELECT username, password, name, isEditor FROM authors ' +
    'WHERE username=' + connection.escape(user);

  connection.query(query, function (err, rows) {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      res.send({success: false, msg: 'Username not found!'});
    } else if (rows[0].password !== pw) {
      res.send({success: false, msg: 'Incorrect password!'});
    } else if (rows[0].isEditor === -1) {
      res.send({
        success: false,
        msg: 'Your account has not been approved yet!'
      });
    } else {
      req.session.login = true;
      req.session.username = user;
      req.session.name = rows[0].name;
      req.session.isEditor = rows[0].isEditor;
      res.send({success: true, msg: 'Welcome!'});
    }
  });

});

app.post('/logout', function (req, res) {
  req.session.login = false;
  req.session.username = undefined;
  res.send({success: true, msg: 'Bye!'});
});

app.get('/home', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  var newRows = [];

  var getInfo = function (item, callback) {
    item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");

    var queryString = 'SELECT name FROM authors WHERE username='
      + connection.escape(item.author);
    connection.query(queryString, function (err, rows) {
      item.authorname = rows[0].name;
      newRows.push(item);
      callback();
    });
  };

  async.waterfall([
    function (callback) {
      var queryString = 'SELECT articleId, isPublished, url, updateDate, ' +
        'title, author, image FROM articles WHERE isPublished!=2';

      if (req.session.isEditor === 0) {
        queryString = queryString + ' AND author=\'' + req.session.username + '\'';
      } else if (req.session.isEditor === 1) {
        queryString = queryString + ' AND (author=\'' + req.session.username + '\'' +
          'OR isPublished=1)';
      }

      queryString = queryString + ' ORDER BY updateDate DESC, articleId DESC';
      connection.query(queryString, callback);
    }, function (rows, fields, callback) {
      async.eachSeries(rows, getInfo, callback);
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
    var returnData = {
      title: 'Home',
      login: req.session.login,
      name: req.session.name,
      console: true,
      articleList: newRows
    };
    res.render('home', returnData);
  });
});

app.get('/profile', function (req, res) {
  if (!req.session.login) {
    res.redirect('/console');
    return;
  }

  var returnData = {
    title: 'Profile',
    login: true,
    console: true
  };

  var query = 'SELECT username, email, name, bio, image FROM authors' +
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

app.post('/editProfile', function (req, res) {
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

var uploadToS3 = function (file, callback) {
  var uuid = require('node-uuid');
  var file_suffix = uuid.v1();
  var s3 = require('s3');
  var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default 
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default 
    multipartUploadThreshold: 20971520, // this is the default (20 MB) 
    multipartUploadSize: 15728640, // this is the default (15 MB) 
    s3Options: {
      accessKeyId: awsObj.accessKeyId,
      secretAccessKey: awsObj.secretAccessKey
      // any other options are passed to new AWS.S3() 
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
    }
  });

  var file_ext = '';

  if (file.mimetype === 'image/jpeg') {
    file_ext = ".jpg";
  } else if (file.mimetype === 'image/png') {
    file_ext = ".png";
  } else {
    res.send({success: false, msg: 'Please upload only .png or .jpg images!'});
  }

  var params = {
    localFile: file.path,
    s3Params: {
      Bucket: 'moviegoer',
      Key: 'uploads/' + file_suffix + file_ext
      // other options supported by putObject, except Body and ContentLength. 
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
    },
    defaultContentType: file.mimetype
  };

  var uploader = client.uploadFile(params);
  uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function () {
    console.log("progress", uploader.progressMd5Amount,
      uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function () {
    console.log("done uploading");
    var image_url = 'https://s3.amazonaws.com/moviegoer/uploads/' + file_suffix + file_ext;
    callback(image_url);
  });
};

app.post('/editProfilePhoto', function (req, res) {
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

app.get('/events', function (req, res) {
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

app.get('/new', function (req, res) {
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

app.get('/article/:id', function (req, res) {
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
        return res.redirect('/newarticle/' + req.params.id);
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

app.get('/deleteArticle/:id', function (req, res) {
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
    res.redirect('/home');
  });
});

app.get('/newarticle/:id', function (req, res) {
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
    res.render('newarticle', returnData);
  });
});

app.post('/saveArticle', function (req, res) {
  var articleId = parseInt(req.body.articleId);
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

app.post('/saveCover', function (req, res) {
  var articleId = parseInt(req.body.articleId);
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

app.post('/addCaption', function (req, res) {
  console.log('caption is here');
  req.session.caption = req.body.caption;
  res.send({success: true});
});

app.post('/addPhoto', function (req, res) {
  var flag = false;
  var articleId = parseInt(req.body.articleId);
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

app.post('/submitArticle', function (req, res) {
  var articleId = parseInt(req.body.articleId);

  var queryString = 'UPDATE articles SET updateDate=NOW(), ' +
    'isPublished=1 WHERE articleId=' + articleId;

  connection.query(queryString, function (err) {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
});

app.post('/publishArticle', function (req, res) {
  var articleId = parseInt(req.body.articleId);

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

app.post('/changePassword', function (req, res) {
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

app.post('/createAccount', function (req, res) {
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

app.post('/approveAccount', function (req, res) {
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

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
