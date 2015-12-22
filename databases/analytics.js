var fs = require('fs');
var apiKey = JSON.parse(fs.readFileSync('json/google.json', 'utf8'));

var googleapis = require('googleapis'),
  JWT = googleapis.auth.JWT,
  analytics = googleapis.analytics('v3');

var authClient = new JWT(
  apiKey.SERVICE_ACCOUNT_EMAIL,
  apiKey.SERVICE_ACCOUNT_KEY_FILE,
  null,
  ['https://www.googleapis.com/auth/analytics.readonly']
);

var getPopularMovies = function (callback) {
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
      callback(result.rows);
    });
  });
};

module.exports = getPopularMovies;