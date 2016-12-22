import express from "express"
import {db} from "../db"

const router = express.Router();

router.get('/', function (req, res) {
  const search = ['%' + req.query.query + '%'];
  db.queryAsync(`
    SELECT url, title
    FROM articles
    WHERE title LIKE ?
    ORDER BY pubDate DESC
  `, search
  ).then((articles) => {
    db.queryAsync(`
      SELECT name
      FROM authors
      WHERE name LIKE ?
    `, search).then((authors) => {
      res.send({options: articles.concat(authors)});
    })
  });
});

router.get('/authors', function (req, res) {
  const search = ['%' + req.query.query + '%'];
  db.queryAsync(`
    SELECT username, name
    FROM authors
    WHERE name LIKE ?
  `, search
  ).then((authors) => {
    res.send(authors);
  });
});

router.get('/editors', function (req, res) {
  const search = ['%' + req.query.query + '%'];
  db.queryAsync(`
    SELECT username, name
    FROM authors
    WHERE name LIKE ? AND isEditor > 0
  `, search
  ).then((editors) => {
    res.send(editors);
  });
});

export default router;