import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {requireLogin} from "../utils"

const router = express.Router();

router.get('/recent', (req, res) => {
  db.queryAsync(`
    SELECT author, name, url, excerpt, articleId, isPublished, pubDate, title, articles.image
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

router.post('/login', (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  db.queryAsync(`
    SELECT username, password, name, isEditor
    FROM authors
    WHERE username = ?`, [user]
  ).then((rows) => {
    if (rows.length === 0) {
      return res.json({success: false, msg: 'Username not found!'});
    }
    const author = rows[0];
    if (author.isEditor === -1) {
      return res.json({
        success: false,
        msg: 'Your account has not been approved yet!'
      });
    }
    bcrypt.compare(password, author.password, (err, correct) => {
      if (correct) {
        jwt.sign({
          username: user,
          name: author.name,
          isEditor: author.isEditor
        }, process.env.SECRET ? process.env.SECRET : 'secret', {expiresIn: '7 days'}, (err, token) => {
          res.cookie("token", token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)});
          return res.json({success: true, token});
        });
      } else {
        res.json({success: false, msg: 'Incorrect password!'});
      }
    });
  });
});

router.get('/writers', (req, res) => {
  db.queryAsync(`
    SELECT name, image, username
    FROM authors
  `).then((rows) => res.json(rows));
});

router.get('/protected', requireLogin, (req, res) => {
  res.json(res.locals.author);
});

export default router;