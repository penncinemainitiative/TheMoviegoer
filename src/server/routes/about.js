import express from "express"
import {db} from "../db"
import {requireLogin} from "../utils"

const router = express.Router();

router.get('/text', (req, res) => {
  db.queryAsync(`
    SELECT field, description
    FROM about_text
  `).then((rows) => {
    res.json(rows);
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/positions', (req, res) => {
  db.queryAsync(`
    SELECT about.position, about.username, name, image
    FROM about_staff about
    INNER JOIN authors
      ON about.username = authors.username
  `).then((rows) => {
    rows = rows.map((author) => {
      author.url = "/writer/" + author.name.replace(/\s+/g, '');
      return author;
    });
    res.json(rows);
  }).catch((err) => {
    res.json({err});
  });
});

router.post('/text', requireLogin, (req, res) => {
  const about = req.body.about;
  const contact = req.body.contact;
  db.queryAsync(`
    UPDATE about_text
    SET description = ?
    WHERE field = "about"
  `, [about]).then(() => {
    db.queryAsync(`
      UPDATE about_text
      SET description = ?
      WHERE field = "contact"
    `, [contact]).then(() => {
      res.json({success: true});
    });
  });
});

router.post('/positions', requireLogin, (req, res) => {
  const position = req.body.position;
  const author = req.body.author;
  db.queryAsync(`
    UPDATE about_staff
    SET username = ?
    WHERE position = ?
  `, [author, position]).then(() => {
    res.json({success: true});
  });
});

export default router;