var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var session = require('express-session');
var multer  = require('multer');
var s3 = require('multer-s3');
var bodyParser = require('body-parser');
var fs = require('fs');
var secretObj = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
var mysqlObj = JSON.parse(fs.readFileSync('mysqldb.json', 'utf8'));
var awsObj = JSON.parse(fs.readFileSync('aws.json', 'utf8'));
app.engine('ejs', engine);
app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({dest: './uploads/', includeEmptyFields: true}).single('photo'));
app.use( express.static( path.join( __dirname, 'public' )));
app.use(express.static(__dirname + '/views/stylesheets'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/views/js'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: secretObj.secret,
  resave: true,
  saveUninitialized: true,
  login: false
}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : mysqlObj.host,
  user     : mysqlObj.user,
  password : mysqlObj.password,
  port     : mysqlObj.port,
  database : mysqlObj.database
});

var ddb = require('dynamodb').ddb({ 
  accessKeyId: awsObj.accessKeyId, 
  secretAccessKey: awsObj.secretAccessKey,
  region: "us-east-1"
});

app.get('/', function (req, res) {
  var t = 'The Moviegoer';
  res.render('index', { 
    title: t,
    login: false,
    console: false
  });
});

app.get('/console', function (req, res) {
  if(req.session.login) {
    res.redirect('/home');
    return;
  }

  var t = 'Author Console';
  res.render('console', { 
    title: t,
    login: false,
    console: true
  });
});

app.post('/login', function (req, res) {
  var user = req.body.username;
  var pw = req.body.password;

  var query = 'SELECT username, password, name FROM authors WHERE username=\'' + user + '\'';

  connection.query(query, function(err, rows, fields) {
    if (err) {
      throw err;
    }

     if (rows.length === 0) {
       res.send({success: false, msg: 'Username not found!'});
     } else if (rows[0].password !== pw) {
       res.send({success: false, msg: 'Incorrect password!'});
    } else {
      req.session.login = true;
      req.session.username = user;
      req.session.name = rows[0].name;
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
  if(!req.session.login) {
    res.redirect('/console');
    return;
  }

  var t = 'Home';
  res.render('home', { 
    title: t,
    login: true,
    console: true
  });
});

app.get('/profile', function (req, res) {
  if(!req.session.login) {
    res.redirect('/console');
    return;
  }

  var t = 'Profile';
  var returnData = {
    title: t,
    login: true,
    console: true
  };

  var query = 'SELECT username, email, name, bio, image' + 
              ' FROM authors WHERE username=\'' + req.session.username + '\'';

  connection.query(query, function(err, rows, fields) {
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
              'name=\'' + name + '\', ' +
              'bio=\'' + bio + '\' WHERE ' + 
              'username=\'' + req.session.username + '\'';

  connection.query(query, function(err, rows, fields) {
    if (err) {
      throw err;
      res.send({success: false});
    } else {
      res.send({success: true});
    }
  });
});

app.post('/editProfilePhoto', function (req, res) {
  var uuid = require('node-uuid');
  var file_suffix = uuid.v1()
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
    },
  });

  var file_ext = '';

  if (req.file.mimetype === 'image/jpeg') {
    file_ext = ".jpg";
  } else if (req.file.mimetype === 'image/png') {
    file_ext = ".png";
  } else {
    res.send({success: false, msg: 'Please upload only .png or .jpg images!'});
  }

  var params = {
    localFile: req.file.path,     
    s3Params: {
      Bucket: 'moviegoer',
      Key: 'uploads/' + file_suffix + file_ext
      // other options supported by putObject, except Body and ContentLength. 
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
    },
    defaultContentType: req.file.mimetype
  };

  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
              uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
    var image_url = 'https://s3.amazonaws.com/moviegoer/uploads/' + file_suffix + file_ext;

    var query = 'UPDATE authors SET ' +
                'image=\'' + image_url + '\' WHERE ' + 
                'username=\'' + req.session.username + '\'';

    connection.query(query, function(err, rows, fields) {
      if (err) {
        throw err;
        res.send({success: false});
      } else {
        res.redirect('/profile');
        return;
      }
    });
  });

});

app.get('/events', function (req, res) {
  if(!req.session.login) {
    res.redirect('/console');
    return;
  }

  var t = 'Events';
  res.render('events', { 
    title: t,
    login: true,
    console: true
  });
});

app.get('/new', function (req, res) {
  if(!req.session.login) {
    res.redirect('/console');
    return;
  }

  var t = 'New Article';
  res.render('new', { 
    title: t,
    login: true,
    console: true,
    name: req.session.name,
    isNew: true
  });
});

app.get('/article/*', function (req, res) {
  if(!req.session.login) {
    res.redirect('/console');
    return;
  }

  var articleId = req.params['0'];

  console.log(articleId);

  var item = { 
    articleId: parseInt(articleId),
    imgList: [ 
      'http://pennmoviegoer.com/images/windrises.jpg',
      'http://pennmoviegoer.com/images/windrises2.jpg'
    ],
    captionList: [
      'Copyright Disney 2015',
      'Copyright Dreamworks 2015'
    ]
  };

  ddb.putItem('articles', item, {}, function (err, res, cap) {
    console.log(err);
    ddb.getItem('articles', parseInt(articleId), null, {}, function (err, res, cap) {
      console.log(res);
    });
  });

  // Pull article from db and render article.ejs
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});