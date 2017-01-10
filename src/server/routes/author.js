import express from "express"
import {db} from "../db"
import {requireLogin, getSignedS3URL} from "../utils"
import bcrypt from "bcrypt"
import dateFormat from "dateformat"
import url from "url"

const router = express.Router();

router.get('/:writer', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, image, accent_color, bio, hometown, position, allow_featured_writer
    FROM authors
    WHERE REPLACE(name, " ", "") = REPLACE(?, " ", "")
  `, [req.params.writer]).then((rows) => {
    const writer = rows[0];
    writer.url = "/writer/" + writer.name.replace(" ", "");
    db.queryAsync(`
      SELECT url, articleId, isPublished, pubDate, title, author, image
      FROM articles
      WHERE isPublished = 2 AND author = ?
      ORDER BY pubDate DESC, articleId DESC
    `, [writer.username]).then((rows) => {
      rows = rows.map((item) => {
        item.pubDate = dateFormat(item.pubDate, "mmmm d, yyyy");
        return item;
      });
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


router.post('/:writer/password', requireLogin, (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const username = req.params.writer;
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
                message: "Password has been successfully changed!"
              });
            });
          });
        });
      } else {
        return res.send({success: false, message: "Incorrect old password!"});
      }
    });
  });
});

router.post('/:writer/description', requireLogin, (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const bio = req.body.bio;
  const hometown = req.body.hometown;
  const accent_color = req.body.accent_color;
  const allow_featured_writer = req.body.allow_featured_writer;
  const username = req.params.writer;
  db.queryAsync(`
    UPDATE authors
    SET name = ?,
        email = ?,
        bio = ?,
        hometown = ?,
        accent_color = ?,
        allow_featured_writer = ?
    WHERE username = ?
  `, [name, email, bio, hometown, accent_color, allow_featured_writer, username]).then(() => {
    res.send({success: true});
  });
});

router.post('/:writer/photo/url', requireLogin, (req, res) => {
  const username = req.params.writer;
  const filename = req.body.filename;
  const filetype = req.body.filetype;
  getSignedS3URL(filename, username, filetype, (err, data) => {
    const strippedURL = url.parse(data).pathname;
    const image = `https://s3.amazonaws.com/moviegoer${strippedURL}`;
    db.queryAsync(`
      UPDATE authors
      SET image = ?
      WHERE username = ?
    `, [image, username]).then(() => {
      res.json({
        signedURL: data,
        cleanURL: image
      });
    })
  });
});

export default router;