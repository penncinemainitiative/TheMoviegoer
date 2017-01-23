import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router();

router.get('/recent', (req, res) => {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  db.queryAsync(`
    SELECT author, name, url, excerpt, articleId, isPublished, pubDate, title, articles.image
    FROM articles
    INNER JOIN authors
      ON username = author
    WHERE isPublished = 2
    ORDER BY pubDate DESC, articleId DESC
    LIMIT 10
    OFFSET ?
  `, [offset]).then((rows) => {
    res.json(rows.map((item) => {
      item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
      return item;
    }));
  }).catch((err) => {
    res.json({err});
  });
});

router.post('/signup', (req, res) => {
  const colors = ["#5DCFC2", "#A3D967", "#D96864", "#A189CF"];
  const insertData = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    isEditor: -1,
    hometown: "",
    allow_featured_writer: 1,
    assignedEditor: req.body.username,
    image: 'https://s3.amazonaws.com/moviegoer/uploads/dlakata/d566f160-dc1b-11e6-8612-954c27f70d36.png',
    accent_color: colors[Math.floor(Math.random() * colors.length)],
    bio: '...'
  };

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      insertData.password = hash;
      db.queryAsync(`
        INSERT INTO authors SET ?
      `, insertData).then(() => {
        res.send({
          success: true,
          msg: 'Account has been created and is awaiting approval!'
        });
      }).catch((err) => {
        res.send({
          success: false,
          msg: 'Try again with a different username!'
        });
      });
    });
  });
});

router.post('/login', (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  db.queryAsync(`
    SELECT username, password, name, isEditor, can_edit_published, can_publish, can_assign_editor
    FROM authors
    INNER JOIN permissions
      ON permissions_role = role
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
          can_edit_published: author.can_edit_published,
          can_publish: author.can_publish,
          can_assign_editor: author.can_assign_editor
        }, process.env.SECRET ? process.env.SECRET : 'secret', {expiresIn: '7 days'}, (err, token) => {
          res.cookie("token", token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)});
          return res.json({success: true, token});
        });
      } else {
        res.json({success: false, msg: 'Incorrect password!'});
      }
    });
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/writers', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, image, accent_color, bio, hometown, position
    FROM authors
    WHERE isEditor > -1 AND name <> 'Admin'
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

router.get('/random/author', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, image, accent_color, bio, hometown, position
    FROM authors
    WHERE LENGTH(bio) > 5 AND allow_featured_writer = 1
    ORDER BY RAND()
    LIMIT 1
  `).then((rows) => {
    const author = rows[0];
    author.url = "/writer/" + author.name.replace(/\s+/g, '');
    res.json(author);
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/staff', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, image, accent_color, bio, hometown, position
    FROM authors
    WHERE position IS NOT NULL
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

const randomArticlesCache = {};
router.get('/random/articles', (req, res) => {
  const n = parseInt(req.query.n) || 2;
  const useCache = req.query.useCache;
  const today = new Date();
  const todayString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const cachedArticles = randomArticlesCache[todayString];
  if (useCache && cachedArticles) {
    return res.json(cachedArticles);
  }
  db.queryAsync(`
    SELECT author, name, url, excerpt, articleId, isPublished, pubDate, title, articles.image
    FROM articles
    INNER JOIN authors
      ON username = author
    WHERE isPublished = 2 and articleId NOT IN
      (
      SELECT articleId
      FROM
        (
        SELECT articleId
        FROM articles
        WHERE isPublished = 2
        ORDER BY pubDate DESC, articleId DESC
        LIMIT 10
        )
      frontPage
      )
    ORDER BY RAND()
    LIMIT ?
  `, [n]).then((rows) => {
    rows = rows.map((item) => {
      item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
      return item;
    });
    if (useCache) {
      randomArticlesCache[todayString] = rows;
    }
    res.json(rows);
  }).catch((err) => {
    res.json({err});
  });
});

export default router;