'use strict';

var fs = require('fs');
var awsObj = JSON.parse(fs.readFileSync('json/aws.json', 'utf8'));

var uploadToS3 = function (file, folder, callback) {
  var uuid = require('node-uuid');
  var file_suffix = folder + '/' + uuid.v1();
  var s3 = require('s3');
  var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
      accessKeyId: awsObj.accessKeyId,
      secretAccessKey: awsObj.secretAccessKey
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    }
  });

  var file_ext = '';

  if (file.mimetype === 'image/jpeg') {
    file_ext = ".jpg";
  } else if (file.mimetype === 'image/png') {
    file_ext = ".png";
  } else {
    res.send({success: false, msg: 'Please upload only .png or .jpg images!'});
  }

  var params = {
    localFile: file.path,
    s3Params: {
      Bucket: 'moviegoer',
      Key: 'uploads/' + file_suffix + file_ext
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },
    defaultContentType: file.mimetype
  };

  var uploader = client.uploadFile(params);
  uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function () {
    console.log("progress", uploader.progressMd5Amount,
      uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function () {
    console.log("done uploading");
    var image_url = 'https://s3.amazonaws.com/moviegoer/uploads/' + file_suffix + file_ext;
    callback(image_url);
  });
};

module.exports = uploadToS3;