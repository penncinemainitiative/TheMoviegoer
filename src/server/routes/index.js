import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router();

const requireLogin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.redirect('/login');
  }
  jwt.verify(token, 'secret', (err, author) => {
    if (err) return res.redirect('/login');
    res.locals.author = author;
    next();
  });
};

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

router.get('/:year/:month/:day/:slug', (req, res) => {
  db.queryAsync(`
    SELECT url, name, articleId, text, articles.image, isPublished, pubDate, title
    FROM articles INNER JOIN authors ON authors.username = articles.author
    WHERE url = ?`, [req.url]
  ).then((rows) => {
    if (rows.length === 0) {
      return res.redirect('/');
    }
    const article = rows[0];
    if (article.isPublished === 0 || article.isPublished === 1) {
      return res.redirect('/article/' + req.params.id + '/draft');
    }
    article.pubDate = dateFormat(article.pubDate, "mmmm d, yyyy");
    article.url = 'http://pennmoviegoer.com' + article.url;
    res.json(article);
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
        }, 'secret', {expiresIn: '7 days'}, (err, token) => {
          res.cookie("authToken", token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)});
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
    SELECT name, image
    FROM authors
  `).then((rows) => res.json(rows));
});

router.get('/protected', requireLogin, (req, res) => {
  res.json(res.locals.author);
});

export default router;