import express from 'express';
import { Article } from '../db'

const router = express.Router();

router.get('/recent', (req, res) => {
  Article.findOne().then((val) => {
    res.send(val);
  });
});

export default router;