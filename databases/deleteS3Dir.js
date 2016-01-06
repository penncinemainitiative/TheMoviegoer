'use strict';

var fs = require('fs');
var awsObj = JSON.parse(fs.readFileSync('json/aws.json', 'utf8'));

var deleteS3Dir = function (folder, callback) {
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
    }
  });

  var s3Params = {
    Bucket: 'moviegoer',
    Key: 'uploads/' + folder
  };

  var deleter = client.deleteDir(s3Params);
  deleter.on('error', function (err) {
    console.error("unable to delete:", err.stack);
  });

  deleter.on('end', function () {
    console.log("done deleting");
    callback(folder);
  });
};

module.exports = deleteS3Dir;