import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"

const router = express.Router();

router.get('/recent', (req, res) => {
  db.queryAsync(
    'SELECT author, name, url, articleId, isPublished, pubDate, title, articles.image FROM articles ' +
    'INNER JOIN authors ON username = author WHERE isPublished = 2 ORDER BY pubDate DESC, articleId DESC LIMIT 10'
  ).then((rows) => {
    res.send(rows.map((item) => {
      item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
      return item;
    }));
  });
});

router.get('/:year/:month/:day/:slug', function (req, res) {
  db.queryAsync(
    'SELECT url, name, articleId, text, articles.image, isPublished, pubDate, title ' +
    'FROM articles INNER JOIN authors ON authors.username = articles.author WHERE url = ?'
    , [req.url]
  ).then((rows) => {
    console.log(rows);
    if (rows.length === 0) {
      return res.redirect('/');
    }
    const article = rows[0];
    if (article.isPublished === 0 || article.isPublished === 1) {
      return res.redirect('/article/' + req.params.id + '/draft');
    }
    article.pubDate = dateFormat(article.pubDate, "mmmm d, yyyy");
    article.url = 'http://pennmoviegoer.com' + article.url;
    res.send(article);
  });
});

export default router;