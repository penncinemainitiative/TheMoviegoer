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
      return console.log(err);
    }

    analytics.data.ga.get({
      auth: authClient,
      'ids': apiKey.GA_PAGE_ID,
      'dimensions': 'ga:pageTitle,ga:pagePath',
      'metrics': 'ga:pageviews',
      'start-date': '7daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:pageviews',
      'max-results': 10,
      'filters': 'ga:pagePath=~/*[.]html$'
    }, function (err, result) {
      var deduped = result.rows.reduce(function (arr, b) {
        if (arr.indexOf(b[1]) < 0)
          arr.push(b[1]);
        return arr;
      }, []);
      callback(null, deduped);
    });
  });
};

var getPopularMovies = function (call) {
  var getInfo = function (url, callback) {
    var queryString = 'SELECT articles.pubDate, articles.url, articles.image, ' +
      'articles.title, authors.name AS authorname FROM articles ' +
      'INNER JOIN authors ON authors.username = articles.author WHERE articles.isPublished = 2 AND url=? LIMIT 10';
    connection.query(queryString, [url], function (err, rows) {
      if (rows.length === 0) {
        return callback(null, null);
      }
      rows[0].pubDate = dateFormat(rows[0].pubDate, "mmmm d, yyyy");
      callback(err, rows[0]);
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
      call(err, cache[today]);
    });
  }
};

module.exports = getPopularMovies;