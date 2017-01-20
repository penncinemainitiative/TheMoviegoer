const baseURL = 'http://localhost:8000';

casper.start(baseURL);

casper.test.begin("Sanity check of react router", function (test) {
  casper.open(baseURL);
  casper.waitForSelector(".homePage", function () {
    casper.evaluate(function () {
      document.querySelectorAll(".nav_item a")[0].click();
    });
    casper.waitForUrl("/articles", function () {
      this.test.assertTitle('Articles');
    });

    casper.then(function () {
      casper.evaluate(function () {
        document.querySelectorAll(".nav_item a")[1].click();
      });
      casper.waitForUrl("/writers", function () {
        this.test.assertTitle('Writers');
      });
    });

    casper.then(function () {
      casper.evaluate(function () {
        document.querySelectorAll(".nav_item a")[2].click();
      });
      casper.waitForUrl("/about", function () {
        this.test.assertTitle('About');
      });
    });
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Sanity check of homepage", function (test) {
  casper.open(baseURL);

  casper.waitForSelector(".homePage", function() {
    this.test.assertTitle('The Moviegoer');

    const bigFeatures =  casper.evaluate(function () {
      return document.querySelectorAll('.big_feature').length;
    });
    this.test.assertEquals(bigFeatures, 1, "Correct number of big features");

    const smallFeatures =  casper.evaluate(function () {
      return document.querySelectorAll('.small_feature').length;
    });
    this.test.assertEquals(smallFeatures, 2, "Correct number of small features");

    const archive =  casper.evaluate(function () {
      return document.querySelectorAll('.archive img').length;
    });
    this.test.assertEquals(archive, 2, "Correct number of archive articles");

    const recent =  casper.evaluate(function () {
      return document.querySelectorAll('.recent li').length;
    });
    this.test.assertEquals(recent, 7, "Correct number of recent articles");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Sanity check of articles page", function (test) {
  casper.open(baseURL + '/articles');

  casper.waitForSelector(".articlesPage", function() {
    this.test.assertTitle('Articles');

    const articles = casper.evaluate(function () {
      return document.querySelectorAll('.list-article').length;
    });

    this.test.assertEquals(articles, 10, "Correct number of articles");

    casper.then(function () {
      this.clickLabel("More?", "p");
      this.waitForResource(/.*api\/recent.*/);
    });

    casper.then(function() {
      const newArticles = casper.evaluate(function () {
        return document.querySelectorAll('.list-article').length;
      });
      this.test.assertEquals(newArticles, 20, "Correct number of new articles");
    })
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Sanity check of writers page", function (test) {
  casper.open(baseURL + '/writers');

  casper.waitForSelector(".writersPage", function() {
    this.test.assertTitle('Writers');

    const featured =  casper.evaluate(function () {
      return document.querySelectorAll('.featured-writer img').length;
    });
    this.test.assertEquals(featured, 1, "Correct number of featured writers");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Sanity check of about page", function (test) {
  casper.open(baseURL + '/about');

  casper.waitForSelector(".aboutPage", function() {
    this.test.assertTitle('About');
  });

  casper.run(function() {
    test.done();
  });
});