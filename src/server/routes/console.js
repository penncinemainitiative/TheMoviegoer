import express from "express"
import {db} from "../db"
import dateFormat from "dateformat"
import {requireLogin} from "../utils"

const router = express.Router();

router.use(requireLogin);

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
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/unpublished', (req, res) => {
  db.queryAsync(`
    SELECT author, name, url, articleId, isPublished, updateDate, articles.assignedEditor, title
    FROM articles
    INNER JOIN authors ON authors.username = articles.author
    WHERE isPublished < 2 AND isPublished > -2
    ORDER BY updateDate DESC, articleId DESC
  `).then((rows) => {
    res.json(rows.map((item) => {
      item.updateDate = dateFormat(item.updateDate, "mmmm d, yyyy");
      item.url = `/article/${item.articleId}/draft`;
      return item;
    }));
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/users', (req, res) => {
  db.queryAsync(`
    SELECT username, name, permissions_role AS role, email
    FROM authors
  `).then((rows) => {
    res.json(rows);
  }).catch((err) => {
    res.json({err});
  });
});

router.post('/users', (req, res) => {
  const username = req.body.username;
  const role = req.body.role;
  db.queryAsync(`
    UPDATE authors
      SET permissions_role = ?
    WHERE username = ?
  `, [role, username]).then(() => {
    res.json({success: true});
  }).catch((err) => {
    res.json({err});
  });
});

router.get('/roles', (req, res) => {
  db.queryAsync(`
    SELECT role, can_assign_author, can_assign_editor, can_delete_articles,
           can_edit_published, can_publish, can_edit_about
    FROM permissions
  `).then((rows) => {
    res.json(rows);
  }).catch((err) => {
    res.json({err});
  });
});

router.post('/roles', (req, res) => {
  const role = req.body.role;
  const permission = req.body.permission;
  const enabled = req.body.enabled;
  db.queryAsync(`
    UPDATE permissions
      SET ${permission} = ?
    WHERE role = ?
  `, [enabled, role]).then(() => {
    res.json({success: true});
  }).catch((err) => {
    res.json({err});
  });
});

export default router;