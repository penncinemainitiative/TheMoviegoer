import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import {requireLogin} from "../utils"

const router = express.Router();

router.use(requireLogin);

router.get('/recent', (req, res) => {
  db.queryAsync(`
    SELECT author, name, url, articleId, isPublished, pubDate, title, articles.image
    FROM articles INNER JOIN authors ON username = author
    WHERE isPublished = 2
    ORDER BY pubDate DESC, articleId DESC
    LIMIT 10
  `).then((rows) => {
    res.json(rows.map((item) => {
      item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
      return item;
    }));
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/unpublished', (req, res) => {
  db.queryAsync(`
    SELECT author, name, url, articleId, isPublished, updateDate, title
    FROM articles
    INNER JOIN authors ON authors.username = articles.author
    WHERE isPublished < 2 AND isPublished > -2
    ORDER BY updateDate DESC, articleId DESC
  `).then((rows) => {
    res.json(rows.map((item) => {
      item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");
      item.url = `/article/${item.articleId}/draft`;
      return item;
    }));
  }).catch((err) => {
    res.json({err});
  });
});

export default router;