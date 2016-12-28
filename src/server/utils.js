import jwt from "jsonwebtoken"

export const requireLogin = (req, res, next) => {
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