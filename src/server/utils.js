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

export const uploadToS3 = (file, folder, callback) => {
  const uuid = require('node-uuid');
  const file_suffix = folder + '/' + uuid.v1();

  let file_ext = '';

  if (file.mimetype === 'image/jpeg') {
    file_ext = ".jpg";
  } else if (file.mimetype === 'image/png') {
    file_ext = ".png";
  } else if (file.mimetype === 'application/msword') {
    file_ext = ".doc";
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    file_ext = ".docx";
  }

  const params = {
    localFile: file.path,
    s3Params: {
      Bucket: 'moviegoer',
      Key: 'uploads/' + file_suffix + file_ext
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },
    defaultContentType: file.mimetype
  };

  const uploader = client.uploadFile(params);
  uploader.on('error', (err) => {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', () => {
    console.log("progress", uploader.progressMd5Amount,
      uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', () => {
    console.log("done uploading");
    const image_url = 'https://s3.amazonaws.com/moviegoer/uploads/' + file_suffix + file_ext;
    callback(image_url);
  });
};