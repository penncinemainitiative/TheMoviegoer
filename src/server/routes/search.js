import express from "express"
import {db} from "../db"

const router = express.Router();

router.get('/', (req, res) => {
  const search = [`%${req.query.q}%`];
  db.queryAsync(`
    SELECT url, title
    FROM articles
    WHERE title LIKE ? AND isPublished = 2
    ORDER BY pubDate DESC
  `, search
  ).then((articles) => {
    db.queryAsync(`
      SELECT name
      FROM authors
      WHERE name LIKE ?
    `, search).then((authors) => {
      res.json(articles.concat(authors));
    })
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/authors', (req, res) => {
  const search = [`%${req.query.q}%`];
  db.queryAsync(`
    SELECT username, name
    FROM authors
    WHERE name LIKE ?
  `, search
  ).then((authors) => {
    res.json(authors);
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/editors', (req, res) => {
  const search = [`%${req.query.q}%`];
  db.queryAsync(`
    SELECT username, name
    FROM authors
    WHERE name LIKE ? AND isEditor > 0
  `, search
  ).then((editors) => {
    res.json(editors);
  }).catch((err) => {
    res.json({err});
  });
});

export default router;