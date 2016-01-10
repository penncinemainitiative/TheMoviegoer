var fs = require('fs');
var apiKey = JSON.parse(fs.readFileSync('json/google.json', 'utf8'));
var connection = require('../databases/sql');
var async = require('async');
var dateFormat = require('dateformat');

var googleapis = require('googleapis'),
  JWT = googleapis.auth.JWT,
  analytics = googleapis.analytics('v3');

var authClient = new JWT(
  apiKey.SERVICE_ACCOUNT_EMAIL,
  apiKey.SERVICE_ACCOUNT_KEY_FILE,
  null,
  ['https://www.googleapis.com/auth/analytics.readonly']
);

var cache = {};

var getFromGoogle = function (callback) {
  authClient.authorize(function (err) {
    if (err) {
      console.log(err);
      return;
    }

    analytics.data.ga.get({
      auth: authClient,
      'ids': apiKey.GA_PAGE_ID,
      'dimensions': 'ga:pageTitle,ga:pagePath',
      'metrics': 'ga:pageviews',
      'start-date': '7daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:pageviews',
      'max-results': 5,
      'filters': 'ga:pagePath=~/*[.]html$'
    }, function (err, result) {
      callback(null, result.rows);
    });
  });
};

var getPopularMovies = function(call) {
  var getInfo = function (item, callback) {
    var url = item[1];
    var queryString = 'SELECT pubDate, url, image, author, title FROM articles WHERE url=' + connection.escape(url);
    var movie = {};
    connection.query(queryString, function(err, rows) {
      movie.image = rows[0].image;
      movie.title = rows[0].title;
      movie.author = rows[0].author;
      movie.pubDate = dateFormat(rows[0].pubDate, "mmmm d, yyyy");
      movie.url = rows[0].url;

      queryString = 'SELECT name FROM authors WHERE username='
        + connection.escape(movie.author);
      connection.query(queryString, function (err, rows) {
        movie.authorname = rows[0].name;
        callback(err, movie);
      });
    });
  };

  var today = new Date();
  today = today.getDate() + '/' + today.getMonth() + 1 + '/' + today.getFullYear();
  if (cache[today]) {
    call(null, cache[today]);
  } else {
    async.waterfall([
      function (callback) {
        getFromGoogle(callback);
      }, function (result, callback) {
        async.map(result, getInfo, callback);
      }
    ], function (err, result) {
      cache[today] = result;
      call(err, result);
    });
  }
};

module.exports = getPopularMovies;