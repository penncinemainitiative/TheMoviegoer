import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"

const router = express.Router();

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
  });
});

export default router;