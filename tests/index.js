casper.options.clientScripts = ["static/js/raw/jquery-3.1.1.min.js"];
const baseURL = 'http://localhost:8000';

casper.start(baseURL);

function finish() {
  casper.evaluate(function () {
    $.ajax('/coverage/client', {
      data: JSON.stringify(window.__coverage__),
      contentType: 'application/json',
      type: 'POST'
    });
  });
  casper.run(function () {
    this.test.done();
  });
}

function login() {
  casper.then(function () {
    this.clickLabel("Go to Author Console", "a");
  });
  casper.then(function () {
    casper.waitForSelector(".loginPage", function () {
      this.test.assertTitle('Login | The Moviegoer');
      this.sendKeys('#username', casper.cli.get('username'));
      this.sendKeys('#password', casper.cli.get('password'));
      this.clickLabel("Login", "button");
      casper.waitForResource(/.*api\/author.*/);
    });
  });

  casper.then(function () {
    casper.waitForSelector(".console", function () {
      this.test.assertTitle('Console | The Moviegoer');
    });
  });
}

function logout() {
  casper.then(function () {
    this.clickLabel("Go to Author Console", "a");
  });

  casper.then(function () {
    casper.waitForResource(/.*api\/author.*/, function () {
      this.clickLabel("Logout", "button");
    });
  });

  casper.then(function () {
    casper.waitForSelector(".loginPage", function () {
      this.test.assertTitle('Login | The Moviegoer');
    });
  });
}

casper.test.begin("Ability to login and logout", function (test) {
  login();
  logout();

  casper.thenOpen(baseURL + '/console');

  casper.then(function () {
    casper.waitForSelector(".loginPage", function () {
      this.test.assertTitle('Login | The Moviegoer');
    });
  });

  finish();
});

casper.test.begin("Ability to edit profile", function (test) {
  login();

  const bio = "test bio";

  casper.then(function () {
    this.clickLabel("Update account", "button");
    casper.waitForSelector("#bio", function () {
      this.sendKeys('#bio', bio, {reset: true});
      this.clickLabel("Save", "button");
      casper.evaluate(function () {
        document.querySelector("#profileLink").click();
      });
    });
  });

  casper.then(function () {
    casper.waitForSelector(".writerPage", function () {
      const newBio = casper.evaluate(function () {
        return document.querySelector("#bio").innerText;
      });
      this.test.assertEquals(bio, newBio, "bio updates correctly");
    });
  });

  logout();

  finish();
});

casper.test.begin("Ability to create a new article", function (test) {
  login();

  let draftUrl;

  casper.then(function () {
    this.clickLabel("New article", "button");
    casper.waitForSelector(".draft", function () {
      this.test.assertTitle('Untitled Article | The Moviegoer');
      draftUrl = this.getCurrentUrl();
    });
  });

  casper.then(function () {
    this.clickLabel("Exit", "button");
    casper.waitForSelector(".console", function () {
      this.test.assertTitle('Console | The Moviegoer');
      casper.evaluate(function () {
        document.querySelector(".my-articles td a").click();
      });
    });
  });

  casper.then(function () {
    casper.waitForSelector(".draft", function () {
      this.test.assertTitle('Untitled Article | The Moviegoer');
      this.test.assertEquals(draftUrl, this.getCurrentUrl(), "same draft");
    });
  });

  logout();

  finish();
});

casper.test.begin("Ability to save an article", function (test) {
  login();

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelector(".my-articles td a").click();
    });
  });

  const title = "test title";
  const excerpt = "test excerpt";

  casper.then(function () {
    casper.waitForSelector(".CodeMirror", function () {
      this.sendKeys('#excerpt', excerpt, {reset: true});
      this.sendKeys('#title', title, {reset: true});
      this.clickLabel("Save", "button");
      this.reload(function () {
        casper.waitForSelector(".CodeMirror", function () {
          const newTitle = casper.evaluate(function () {
            return document.querySelector("#title").value;
          });
          const newExcerpt = casper.evaluate(function () {
            return document.querySelector("#excerpt").value;
          });
          this.test.assertEquals(newTitle, title, "title was saved");
          this.test.assertEquals(newExcerpt, excerpt, "excerpt was saved");
        });
      });
    });
  });

  logout();

  finish();
});

casper.test.begin("Ability to preview an article", function (test) {
  login();

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelector(".my-articles td a").click();
    });
  });

  const title = "test title";
  const excerpt = "test excerpt";

  casper.then(function () {
    casper.waitForSelector(".CodeMirror", function () {
      this.sendKeys('#excerpt', excerpt, {reset: true});
      this.sendKeys('#title', title, {reset: true});
      this.clickLabel("Preview", "button");
    });
  });

  casper.then(function () {
    casper.waitWhileSelector(".CodeMirror", function () {
      this.test.assert(this.exists('.articlePage'), "article appears for preview");
      this.clickLabel("Edit", "button");
    });
  });

  casper.then(function () {
    casper.waitForSelector(".CodeMirror", function () {
      this.test.assert(!this.exists('.articlePage'), "article disappears for editing");
    });
  });

  logout();

  finish();
});

casper.test.begin("Ability to publish an article", function (test) {
  login();

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelector(".my-articles td a").click();
    });
  });

  const title = "test title";

  casper.then(function () {
    casper.waitForSelector(".CodeMirror", function () {
      this.sendKeys('#title', title, {reset: true});
      this.clickLabel("Publish", "button");
    });
  });

  casper.then(function () {
    casper.waitForSelector(".big_feature", function () {
      const newTitle = casper.evaluate(function () {
        return document.querySelector(".big_feature h2").innerText;
      });
      this.test.assert(newTitle.includes(title), "article is published with correct title");
    });
  });

  logout();

  finish();
});

casper.test.begin("Sanity check of react router", function (test) {
  casper.thenOpen(baseURL);
  casper.waitForSelector(".homePage");

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelectorAll(".nav_item a")[0].click();
    });
    casper.waitForSelector(".articlesPage", function () {
      this.test.assertTitle('Articles | The Moviegoer');
    });
  });

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelectorAll(".nav_item a")[1].click();
    });
    casper.waitForSelector(".writersPage", function () {
      this.test.assertTitle('Writers | The Moviegoer');
    });
  });

  casper.then(function () {
    casper.evaluate(function () {
      document.querySelectorAll(".nav_item a")[2].click();
    });
    casper.waitForSelector(".aboutPage", function () {
      this.test.assertTitle('About | The Moviegoer');
    });
  });

  finish();
});

casper.test.begin("Sanity check of homepage", function (test) {
  casper.thenOpen(baseURL);
  casper.waitForSelector(".homePage");

  casper.then(function () {
    this.test.assertTitle('The Moviegoer');

    const bigFeatures = casper.evaluate(function () {
      return document.querySelectorAll('.big_feature').length;
    });
    this.test.assertEquals(bigFeatures, 1, "Correct number of big features");

    const smallFeatures = casper.evaluate(function () {
      return document.querySelectorAll('.small_feature').length;
    });
    this.test.assertEquals(smallFeatures, 2, "Correct number of small features");

    const archive = casper.evaluate(function () {
      return document.querySelectorAll('.archive img').length;
    });
    this.test.assertEquals(archive, 2, "Correct number of archive articles");

    const recent = casper.evaluate(function () {
      return document.querySelectorAll('.recent li').length;
    });
    this.test.assertEquals(recent, 7, "Correct number of recent articles");
  });

  finish();
});

casper.test.begin("Sanity check of articles page", function (test) {
  casper.thenOpen(baseURL + '/articles');
  casper.waitForSelector(".articlesPage");

  casper.then(function () {
    this.test.assertTitle('Articles | The Moviegoer');

    const articles = casper.evaluate(function () {
      return document.querySelectorAll('.list-article').length;
    });

    this.test.assertEquals(articles, 10, "Correct number of articles");

    casper.then(function () {
      this.clickLabel("More?", "p");
      this.waitForResource(/.*api\/recent.*/);
    });

    casper.then(function () {
      const newArticles = casper.evaluate(function () {
        return document.querySelectorAll('.list-article').length;
      });
      this.test.assertEquals(newArticles, 20, "Correct number of new articles");
    });
  });

  finish();
});

casper.test.begin("Sanity check of article page", function (test) {
  casper.thenOpen(baseURL);
  casper.waitForSelector(".homePage");

  casper.then(function () {
    casper.evaluate(function () {
      return document.querySelector(".recent a").click();
    });
  });

  casper.then(function () {
    casper.waitForSelector(".articlePage", function () {
      const archive = casper.evaluate(function () {
        return document.querySelectorAll('.archive img').length;
      });
      this.test.assertEquals(archive, 3, "Correct number of archive articles");
    });
  });

  finish();
});

casper.test.begin("Sanity check of writers page", function (test) {
  casper.thenOpen(baseURL + '/writers');
  casper.waitForSelector(".writersPage");

  casper.then(function () {
    this.test.assertTitle('Writers | The Moviegoer');

    const featured = casper.evaluate(function () {
      return document.querySelectorAll('.featured-writer img').length;
    });
    this.test.assertEquals(featured, 1, "Correct number of featured writers");
  });

  finish();
});

casper.test.begin("Sanity check of about page", function (test) {
  casper.thenOpen(baseURL + '/about');
  casper.waitForSelector(".aboutPage");

  casper.then(function () {
    this.test.assertTitle('About | The Moviegoer');
  });

  finish();
});