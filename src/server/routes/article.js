import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import getSlug from "speakingurl"
import {requireLogin, getSignedS3URL} from "../utils"
import url from "url"

const router = express.Router();

router.get('/', requireLogin, (req, res) => {
  db.queryAsync(`
    SELECT username
    FROM authors
    WHERE isEditor = 2
    ORDER BY username DESC
  `).then((rows) => {
    const insertData = {
      isPublished: -1,
      updateDate: new Date(),
      type: 'feature',
      title: 'Untitled Article',
      author: res.locals.author.username,
      assignedEditor: rows[0].username,
      url: 'http://pennmoviegoer.com',
      excerpt: '...',
      text: '...',
      image: 'https://www.royalacademy.org.uk/' +
      'assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg'
    };
    db.queryAsync(`
      INSERT INTO articles SET ?
    `, [insertData]).then((result) => {
      const articleId = result.insertId;
      res.json({articleId});
    });
  });
});

router.get('/:year/:month/:day/:slug', (req, res) => {
  db.queryAsync(`
    SELECT url, name, articleId, text, articles.image, isPublished, pubDate, title,
           authors.image AS authorImage, bio, username
    FROM articles
    INNER JOIN authors ON authors.username = articles.author
    WHERE url = ?`, [req.url]
  ).then((rows) => {
    if (rows.length === 0) {
      return res.redirect('/');
    }
    const article = rows[0];
    if (article.isPublished === 0 || article.isPublished === 1) {
      return res.redirect(`/article/${req.params.id}/draft`);
    }
    article.pubDate = dateFormat(article.pubDate, "mmmm d, yyyy");
    article.url = `http://pennmoviegoer.com${article.url}`;
    res.json(article);
  });
});

router.get('/:id/draft', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  db.queryAsync(`
    SELECT excerpt, name, articleId, text, articles.image, isPublished, pubDate, type, title, author
    FROM articles
    INNER JOIN authors ON authors.username = articles.author
    WHERE articleId = ?
  `, [articleId]).then((rows) => {
    const article = rows[0];
    article.date = dateFormat(rows[0].updateDate, "mmmm d, yyyy");
    db.queryAsync(`
      SELECT image AS url
      FROM images
      WHERE articleId = ?
    `, [articleId]).then((rows) => {
      article.imgList = rows;
      res.json(article);
    });
  });
});

router.post('/:id/cover', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  const image = req.body.image;
  db.queryAsync(`
    UPDATE articles
    SET updateDate = NOW(),
        image = ?
    WHERE articleId = ?
  `, [image, articleId]).then(() => {
    res.json({success: true});
  });
});

router.post('/:id/photos', requireLogin, (req, res) => {
  const articleId = req.params.id;
  const filename = req.body.filename;
  const filetype = req.body.filetype;
  getSignedS3URL(filename, articleId, filetype, (err, data) => {
    const strippedURL = url.parse(data).pathname;
    const image = `https://s3.amazonaws.com/moviegoer${strippedURL}`;
    db.queryAsync(`
      UPDATE articles
      SET image = ?,
          updateDate = NOW()
      WHERE articleId = ?
    `, [image, articleId]).then(() => {
      db.queryAsync(`
        INSERT INTO images
        SET ?
      `, {articleId, image}).then(() => {
        res.json({
          signedURL: data,
          cleanURL: image
        });
      });
    })
  });
});

router.get('/:id/delete', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  db.queryAsync(`
    DELETE FROM articles WHERE articleId = ?
  `, [articleId]).then(() => {
    db.queryAsync(`
      DELETE FROM images WHERE articleId = ?
    `, [articleId]).then(() => {
      db.queryAsync(`
        DELETE FROM drafts WHERE articleId = ?
      `, [articleId]).then(() => {
        res.json({success: true});
      });
    });
  });
});

router.post('/:id', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  const text = req.body.text.replace(/<script.*?>.*?<\/script>/igm, "");
  db.queryAsync(`
    UPDATE articles
    SET updateDate = NOW(),
        title = ?,
        text = ?,
        excerpt = ?
    WHERE articleId = ?
  `, [req.body.title, text, req.body.excerpt, articleId]).then(() => {
    res.json({success: true});
  });
});

router.post('/:id/publish', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  db.queryAsync(`
    SELECT title
    FROM articles
    WHERE articleId = ?
  `, [articleId]).then((rows) => {
    const article = rows[0];
    const today = new Date();
    const month = today.getMonth() + 1;
    const slug = getSlug(article.title.replace(/(<([^>]+)>)/ig, ""));
    const url = `/${today.getFullYear()}/${month}/${today.getDate()}/${slug}.html`;
    db.queryAsync(`
      UPDATE articles
      SET pubDate = NOW(),
          url = ?,
          updateDate = NOW(),
          isPublished = 2
      WHERE articleId = ?
    `, [url, articleId]).then(() => {
      res.send({success: true});
    });
  });
});

router.post('/:id/author', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  db.queryAsync(`
    UPDATE articles
    SET updateDate = NOW(),
        author = ?
    WHERE articleId = ?
  `, [req.body.author, articleId]).then(() => {
    res.send({success: true});
  });
});

router.post('/:id/retract', requireLogin, (req, res) => {
  const articleId = parseInt(req.params.id);
  db.queryAsync(`
    UPDATE articles
    SET updateDate = NOW(),
        isPublished = -1
    WHERE articleId = ?
  `, [articleId]).then(() => {
    res.send({success: true});
  });
});

export default router;