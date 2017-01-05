import express from "express"
import {db} from "../db"
import {requireLogin} from "../utils"
import bcrypt from "bcrypt"
import dateFormat from "dateformat"

const router = express.Router();

router.get('/:writer', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, bio, image
    FROM authors
    WHERE REPLACE(name, " ", "") = REPLACE(?, " ", "")
  `, [req.params.writer]).then((rows) => {
    const writer = rows[0];
    db.queryAsync(`
    SELECT url, articleId, isPublished, pubDate, title, author, image
    FROM articles
    WHERE isPublished = 2 AND author = ?
    ORDER BY pubDate DESC, articleId DESC
  `, [writer.username]).then((rows) => {
      writer.articles = rows;
      res.json(writer);
    });
  });
});

router.get('/:writer/unpublished', requireLogin, (req, res) => {
  const writer = req.params.writer;
  db.queryAsync(`
    SELECT author, name, url, articleId, isPublished, updateDate, title
    FROM articles
    INNER JOIN authors ON authors.username = articles.author
    WHERE isPublished < 2 AND author = ?
    ORDER BY updateDate DESC, articleId DESC
  `, [writer]).then((rows) => {
    res.json(rows.map((item) => {
      item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");
      item.url = `/article/${item.articleId}/draft`;
      return item;
    }));
  });
});


router.post('/password', requireLogin, (req, res) => {
  const oldPassword = req.body.oldpassword;
  const newPassword = req.body.newpassword;
  const username = res.locals.author.username;
  db.queryAsync(`
    SELECT password
    FROM authors
    WHERE username = ?
  `, [username]).then((rows) => {
    const password = rows[0].password;
    bcrypt.compare(oldPassword, password, (err, correct) => {
      if (correct) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            db.queryAsync(`
              UPDATE authors
              SET password = ?
              WHERE username = ?
            `, [hash, username]).then(() => {
              res.send({
                success: true,
                msg: "Password has been successfully changed!"
              });
            });
          });
        });
      } else {
        return res.send({success: false, msg: "Incorrect old password!"});
      }
    });
  });
});

router.post('/description', requireLogin, (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const bio = req.body.bio;
  const username = res.locals.author.username;
  db.queryAsync(`
    UPDATE authors
    SET name = ?
        email = ?
        bio = ?
    WHERE username = ?
  `, [name, email, bio]).then(() => {
    res.send({success: true});
  });
});

export default router;