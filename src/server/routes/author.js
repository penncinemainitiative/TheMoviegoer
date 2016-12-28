import express from "express"
import {db} from "../db"

const router = express.Router();

router.get('/:writer', (req, res) => {
  db.queryAsync(`
    SELECT username, email, name, bio, image
    FROM authors
    WHERE REPLACE(name, " ", "") = REPLACE(?, " ", "")
  `, [req.params.writer]).then((rows) => {
    res.json(rows[0]);
  });
});

export default router;