import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"

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
    isEditor: 0,
    hometown: "",
    allow_featured_writer: 1,
    assignedEditor: req.body.username,
    image: 'https://s3.amazonaws.com/moviegoer/uploads/dlakata/d566f160-dc1b-11e6-8612-954c27f70d36.png',
    accent_color: colors[Math.floor(Math.random() * colors.length)],
    bio: '...',
    permissions_role: "unconfirmed"
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

const forgotEmail = "forgotmymoviegoer@gmail.com";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: forgotEmail,
    pass: process.env.FORGOT_PASS
  }
});

router.post('/forgot', (req, res) => {
  const username = req.body.username;
  db.queryAsync(`
    SELECT email
    FROM authors
    WHERE username = ?`, [username]
  ).then((rows => {
    if (rows.length === 0) {
      return res.json({success: false, msg: 'Email not found!'});
    }
    const author = rows[0];
    const email = author.email;
    const newPassword = crypto.randomBytes(20).toString('hex');

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        db.queryAsync(`
          UPDATE authors
          SET password = ?
          WHERE username = ?
      `, [hash, username]).then(() => {
          const mailOptions = {
            from: forgotEmail,
            to: email,
            subject: "You forgot your password!",
            text: `New password: ${newPassword}`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.json({success: false, msg: error});
            }
            res.json({success: true, msg: "Sent!"});
          });
        });
      });
    });
  }));
});

router.post('/login', (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  db.queryAsync(`
    SELECT username, password, name, can_edit_published, can_publish,
           can_assign_editor, can_edit_about, can_edit_permissions, can_delete_articles,
           can_assign_author, permissions_role
    FROM authors
    INNER JOIN permissions
      ON permissions_role = role
    WHERE username = ?`, [user]
  ).then((rows) => {
    if (rows.length === 0) {
      return res.json({success: false, msg: 'Username not found!'});
    }
    const author = rows[0];
    if (author.permissions_role === "unconfirmed") {
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
          can_assign_editor: author.can_assign_editor,
          can_edit_permissions: author.can_edit_permissions,
          can_edit_about: author.can_edit_about,
          can_assign_author: author.can_assign_author,
          can_delete_articles: author.can_delete_articles
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
    SELECT username, email, name, image, accent_color, bio, hometown, position, permissions_role
    FROM authors
    WHERE permissions_role <> 'unconfirmed'
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