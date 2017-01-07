import jwt from "jsonwebtoken"
import fs from "fs"
import aws from "aws-sdk"

export const requireLogin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.redirect('/login');
  }
  jwt.verify(token, process.env.SECRET ? process.env.SECRET : 'secret', (err, author) => {
    if (err) return res.redirect('/login');
    res.locals.author = author;
    next();
  });
};

const awsObj = JSON.parse(fs.readFileSync('json/aws.json', 'utf8'));
aws.config.update(awsObj);

export const getSignedS3URL = (filename, folder, filetype, callback) => {
  const s3 = new aws.S3();
  const uuid = require('node-uuid');
  const file_suffix = folder + '/' + uuid.v1();

  let file_ext = '';

  if (filetype === 'image/jpeg') {
    file_ext = ".jpg";
  } else if (filetype === 'image/png') {
    file_ext = ".png";
  }

  const params = {
    Bucket: 'moviegoer',
    Key: 'uploads/' + file_suffix + file_ext,
    Expires: 60,
    ContentType: filetype
  };

  s3.getSignedUrl("putObject", params, (err, data) => {
    callback(err, data);
  });
};